import { selector } from 'recoil';
import { Properties } from '@kintone/rest-api-client/lib/client/types';
import {
  DEFAULT_DEFINED_FIELDS,
  getFieldProperties,
  omitFieldProperties,
} from '@common/kintone-api';

const state = selector<Properties>({
  key: 'AppFields',
  get: async () => {
    const properties = await getFieldProperties();
    const omitted = omitFieldProperties(properties, [...DEFAULT_DEFINED_FIELDS, 'SUBTABLE']);

    return omitted;
  },
});

export default state;
