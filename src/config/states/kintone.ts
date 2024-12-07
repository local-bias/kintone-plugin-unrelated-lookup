import { selector } from 'recoil';
import { FIELD_TYPES_SYSTEM, omitFieldProperties } from '@/lib/kintone-api';
import { conditionTypeState, dstSubtableFieldCodeState, srcAppIdState } from './plugin';
import {
  getAllApps,
  getAppId,
  getFormFields,
  getSpace,
  withSpaceIdFallback,
} from '@konomi-app/kintone-utilities';
import { kintoneAPI } from '@konomi-app/kintone-utilities/dist/types/api';
import { ENV, GUEST_SPACE_ID } from '@/lib/global';

const PREFIX = 'kintone';

export const kintoneAppsState = selector({
  key: `${PREFIX}kintoneAppsState`,
  get: async ({ get }) => {
    const apps = await getAllApps({
      guestSpaceId: GUEST_SPACE_ID,
      debug: ENV === 'development',
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
      debug: ENV === 'development',
    });
    const omitted = omitFieldProperties(properties, [...FIELD_TYPES_SYSTEM, 'SUBTABLE']);

    return omitted;
  },
});

export const dstAppPropertiesState = selector<kintoneAPI.FieldProperties>({
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
      debug: ENV === 'development',
    });

    return properties;
  },
});

export const targetDstAppPropertiesState = selector<kintoneAPI.FieldProperty[]>({
  key: `${PREFIX}targetDstAppPropertiesState`,
  get: async ({ get }) => {
    const dstAppProperties = get(dstAppPropertiesState);
    const omitted = omitFieldProperties(dstAppProperties, [...FIELD_TYPES_SYSTEM, 'SUBTABLE']);
    return Object.values(omitted).sort((a, b) => a.label.localeCompare(b.label, 'ja'));
  },
});

export const dstAppSubtablePropertiesState = selector<kintoneAPI.property.Subtable[]>({
  key: `${PREFIX}dstAppSubtablePropertiesState`,
  get: async ({ get }) => {
    const dstAppProperties = get(dstAppPropertiesState);
    const subtables = Object.values(dstAppProperties).filter((field) => field.type === 'SUBTABLE');
    return subtables;
  },
});

export const dstAppInsubtablePropertiesState = selector<kintoneAPI.property.InSubtable[]>({
  key: `${PREFIX}dstAppInsubtablePropertiesState`,
  get: async ({ get }) => {
    const subtableProperties = get(dstAppSubtablePropertiesState);
    const fieldCode = get(dstSubtableFieldCodeState);
    if (!fieldCode) {
      return [];
    }

    const subtable = subtableProperties.find((field) => field.code === fieldCode);
    if (!subtable) {
      return [];
    }

    const omitted = omitFieldProperties(subtable.fields, [...FIELD_TYPES_SYSTEM, 'SUBTABLE']);
    return Object.values(omitted).sort((a, b) =>
      a.label.localeCompare(b.label, 'ja')
    ) as kintoneAPI.property.InSubtable[];
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
      debug: ENV === 'development',
    });
    const filtered = omitFieldProperties(properties, ['GROUP', 'SUBTABLE']);

    return Object.values(filtered).sort((a, b) => a.label.localeCompare(b.label, 'ja'));
  },
});
