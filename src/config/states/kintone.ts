import { selector, selectorFamily } from 'recoil';
import { Properties } from '@kintone/rest-api-client/lib/client/types';
import {
  DEFAULT_DEFINED_FIELDS,
  getFieldProperties,
  kintoneClient,
  omitFieldProperties,
} from '@common/kintone-api';
import { getAllApps } from '@common/kintone-rest-api';
import { getAppId } from '@lb-ribbit/kintone-xapp';
import { kx } from '@type/kintone.api';
import { srcAppIdState } from './plugin';

const PREFIX = 'kintone';

export const kintoneAppsState = selector({
  key: `${PREFIX}kintoneAppsState`,
  get: async () => {
    const apps = await getAllApps();
    return apps;
  },
});

export const appFieldsState = selector<Properties>({
  key: `${PREFIX}AppFields`,
  get: async () => {
    const app = getAppId();
    if (!app) {
      throw new Error('アプリのフィールド情報が取得できませんでした');
    }

    const { properties } = await kintoneClient.app.getFormFields({ app, preview: true });
    const omitted = omitFieldProperties(properties, [...DEFAULT_DEFINED_FIELDS, 'SUBTABLE']);

    return omitted;
  },
});

export const dstAppPropertiesState = selector<kx.FieldProperty[]>({
  key: `${PREFIX}dstAppPropertiesState`,
  get: async () => {
    const app = getAppId();
    if (!app) {
      throw new Error('アプリのフィールド情報が取得できませんでした');
    }

    const { properties } = await kintoneClient.app.getFormFields({ app, preview: true });
    const omitted = omitFieldProperties(properties, [...DEFAULT_DEFINED_FIELDS, 'SUBTABLE']);

    return Object.values(omitted).sort((a, b) => a.label.localeCompare(b.label, 'ja'));
  },
});

export const srcAppPropertiesState = selectorFamily<kx.FieldProperty[], number>({
  key: `${PREFIX}srcAppPropertiesState`,
  get:
    (conditionIndex) =>
    async ({ get }) => {
      const srcAppId = get(srcAppIdState(conditionIndex));
      if (!srcAppId) {
        return [];
      }

      const props = await getFieldProperties(srcAppId);
      const filtered = omitFieldProperties(props, ['GROUP', 'SUBTABLE']);

      return Object.values(filtered).sort((a, b) => a.label.localeCompare(b.label, 'ja'));
    },
});
