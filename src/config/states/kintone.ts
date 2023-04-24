import { selector, selectorFamily } from 'recoil';
import { Properties } from '@kintone/rest-api-client/lib/client/types';
import {
  DEFAULT_DEFINED_FIELDS,
  getFieldProperties,
  omitFieldProperties,
} from '@/common/kintone-api';
import { getAppId } from '@lb-ribbit/kintone-xapp';
import { guestSpaceIdState, srcAppIdState } from './plugin';
import { getAllApps, getFormFields } from '@konomi-app/kintone-utilities';
import { kintoneAPI } from '@konomi-app/kintone-utilities/dist/types/api';

const PREFIX = 'kintone';

export const kintoneAppsState = selector({
  key: `${PREFIX}kintoneAppsState`,
  get: async ({ get }) => {
    const guestSpaceId = get(guestSpaceIdState);
    const apps = await getAllApps({
      guestSpaceId: guestSpaceId ?? undefined,
      debug: process?.env?.NODE_ENV === 'development',
    });
    return apps;
  },
});

export const appFieldsState = selector<Properties>({
  key: `${PREFIX}AppFields`,
  get: async ({ get }) => {
    const app = getAppId();
    if (!app) {
      throw new Error('アプリのフィールド情報が取得できませんでした');
    }
    const guestSpaceId = get(guestSpaceIdState);
    const { properties } = await getFormFields({
      app,
      preview: true,
      guestSpaceId: guestSpaceId ?? undefined,
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

    const guestSpaceId = get(guestSpaceIdState);
    const { properties } = await getFormFields({
      app,
      preview: true,
      guestSpaceId: guestSpaceId ?? undefined,
      debug: process?.env?.NODE_ENV === 'development',
    });
    const omitted = omitFieldProperties(properties, [...DEFAULT_DEFINED_FIELDS, 'SUBTABLE']);

    return Object.values(omitted).sort((a, b) => a.label.localeCompare(b.label, 'ja'));
  },
});

export const srcAppPropertiesState = selectorFamily<kintoneAPI.FieldProperty[], number>({
  key: `${PREFIX}srcAppPropertiesState`,
  get:
    (conditionIndex) =>
    async ({ get }) => {
      const srcAppId = get(srcAppIdState(conditionIndex));
      if (!srcAppId) {
        return [];
      }

      const guestSpaceId = get(guestSpaceIdState);
      const props = await getFieldProperties({
        targetApp: srcAppId,
        preview: true,
        guestSpaceId: guestSpaceId ?? undefined,
      });
      const filtered = omitFieldProperties(props, ['GROUP', 'SUBTABLE']);

      return Object.values(filtered).sort((a, b) => a.label.localeCompare(b.label, 'ja'));
    },
});
