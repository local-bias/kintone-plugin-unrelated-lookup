import { selector } from 'recoil';
import { Properties } from '@kintone/rest-api-client/lib/client/types';
import {
  DEFAULT_DEFINED_FIELDS,
  getFieldProperties,
  omitFieldProperties,
} from '@common/kintone-api';
import { getAllApps } from '@common/kintone-rest-api';

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
    const properties = await getFieldProperties();
    const omitted = omitFieldProperties(properties, [...DEFAULT_DEFINED_FIELDS, 'SUBTABLE']);

    return omitted;
  },
});
