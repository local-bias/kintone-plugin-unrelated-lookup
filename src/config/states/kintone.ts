import { selector, selectorFamily } from 'recoil';
import {
  DEFAULT_DEFINED_FIELDS,
  getFieldProperties,
  omitFieldProperties,
} from '@/common/kintone-api';
import { getAppId } from '@lb-ribbit/kintone-xapp';
import { getAllApps, getFormFields } from '@konomi-app/kintone-utilities';
import { kintoneAPI } from '@konomi-app/kintone-utilities/dist/types/api';
import { GUEST_SPACE_ID } from '@/common/global';

const PREFIX = 'kintone';

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
