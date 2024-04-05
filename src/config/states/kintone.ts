import { selector } from 'recoil';
import { DEFAULT_DEFINED_FIELDS, omitFieldProperties } from '@/lib/kintone-api';
import { getAppId } from '@lb-ribbit/kintone-xapp';
import { srcAppIdState } from './plugin';
import {
  getAllApps,
  getFormFields,
  getSpace,
  withSpaceIdFallback,
} from '@konomi-app/kintone-utilities';
import { kintoneAPI } from '@konomi-app/kintone-utilities/dist/types/api';
import { GUEST_SPACE_ID } from '@/lib/global';

const PREFIX = 'kintone';

export const kintoneAppsState = selector({
  key: `${PREFIX}kintoneAppsState`,
  get: async ({ get }) => {
    const apps = await getAllApps({
      guestSpaceId: GUEST_SPACE_ID,
      debug: process?.env?.NODE_ENV === 'development',
    });
    return apps;
  },
});

export const kintoneSpacesState = selector<kintoneAPI.rest.space.GetSpaceResponse[]>({
  key: `${PREFIX}kintoneSpacesState`,
  get: async ({ get }) => {
    const apps = get(kintoneAppsState);
    const spaceIds = [
      ...new Set(apps.filter((app) => app.spaceId).map<string>((app) => app.spaceId as string)),
    ];

    let spaces: kintoneAPI.rest.space.GetSpaceResponse[] = [];
    for (const id of spaceIds) {
      const space = await withSpaceIdFallback({
        spaceId: id,
        func: getSpace,
        funcParams: { id, debug: true },
      });
      spaces.push(space);
    }

    return spaces;
  },
});

export const appFieldsState = selector<kintoneAPI.FieldProperties>({
  key: `${PREFIX}AppFields`,
  get: async ({ get }) => {
    const app = getAppId();
    if (!app) {
      throw new Error('アプリのフィールド情報が取得できませんでした');
    }
    const { properties } = await getFormFields({
      app,
      preview: true,
      guestSpaceId: GUEST_SPACE_ID,
      debug: process?.env?.NODE_ENV === 'development',
    });
    const omitted = omitFieldProperties(properties, [...DEFAULT_DEFINED_FIELDS, 'SUBTABLE']);

    return omitted;
  },
});

export const dstAppPropertiesState = selector<kintoneAPI.FieldProperty[]>({
  key: `${PREFIX}dstAppPropertiesState`,
  get: async ({ get }) => {
    const app = getAppId();
    if (!app) {
      throw new Error('アプリのフィールド情報が取得できませんでした');
    }

    const { properties } = await getFormFields({
      app,
      preview: true,
      guestSpaceId: GUEST_SPACE_ID,
      debug: process?.env?.NODE_ENV === 'development',
    });
    const omitted = omitFieldProperties(properties, [...DEFAULT_DEFINED_FIELDS, 'SUBTABLE']);

    return Object.values(omitted).sort((a, b) => a.label.localeCompare(b.label, 'ja'));
  },
});

export const srcAppPropertiesState = selector<kintoneAPI.FieldProperty[]>({
  key: `${PREFIX}srcAppPropertiesState`,
  get: async ({ get }) => {
    const srcAppId = get(srcAppIdState);
    if (!srcAppId) {
      return [];
    }

    const allApps = get(kintoneAppsState);
    const srcApp = allApps.find((app) => app.appId === srcAppId);
    if (!srcApp) {
      return [];
    }

    let guestSpaceId;
    if (srcApp.spaceId) {
      const spaces = get(kintoneSpacesState);
      const space = spaces.find((s) => s.id === srcApp.spaceId);
      if (space?.isGuest) {
        guestSpaceId = space.id;
      }
    }

    const { properties } = await getFormFields({
      app: srcAppId,
      preview: true,
      guestSpaceId,
      debug: process?.env?.NODE_ENV === 'development',
    });
    const filtered = omitFieldProperties(properties, ['GROUP', 'SUBTABLE']);

    return Object.values(filtered).sort((a, b) => a.label.localeCompare(b.label, 'ja'));
  },
});
