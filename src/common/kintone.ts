import { Record as KintoneRecord } from '@kintone/rest-api-client/lib/client/types';

export const getQuickSearchString = (record: KintoneRecord): string => {
  const values = Object.values(record).map((field) => {
    switch (field.type) {
      case 'CREATOR':
      case 'MODIFIER':
        return field.value.name;

      case 'CHECK_BOX':
      case 'MULTI_SELECT':
      case 'CATEGORY':
        return field.value.join('');

      case 'USER_SELECT':
      case 'ORGANIZATION_SELECT':
      case 'GROUP_SELECT':
      case 'STATUS_ASSIGNEE':
        return field.value.map(({ name }) => name).join('');

      case 'FILE':
        return field.value.map(({ name }) => name).join('');

      case 'SUBTABLE':
        return field.value.map(({ value }) => getQuickSearchString(value)).join('');

      default:
        return field.value || '';
    }
  });

  return values.join('');
};
