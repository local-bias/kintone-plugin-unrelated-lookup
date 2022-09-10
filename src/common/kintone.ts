import { Record as KintoneRecord } from '@kintone/rest-api-client/lib/client/types';
import { Cybozu } from '../types/cybozu';

declare const cybozu: Cybozu;

/** 実行されている環境がモバイル端末である場合はTrueを返却します */
export const isMobile = (eventType?: string): boolean => {
  if (eventType) {
    return eventType.includes('mobile.');
  }
  return cybozu?.data?.IS_MOBILE_DEVICE ?? !kintone.app.getId();
};

/** モバイル対応 ```kintone.app()``` */
export const getApp = (eventType?: string): typeof kintone.mobile.app | typeof kintone.app =>
  isMobile(eventType) ? kintone.mobile.app : kintone.app;

/** モバイル対応 ```kintone.app.getId()``` */
export const getAppId = (): number | null => getApp().getId();

/** モバイル対応 ```kintone.app.record.getId()``` */
export const getRecordId = (): number | null => getApp().record.getId();

/** モバイル対応 ```kintone.app.record.getSpaceElement()``` */
export const getSpaceElement = (spaceId: string): HTMLElement | null =>
  getApp().record.getSpaceElement(spaceId);

/** モバイル対応 ```kintone.app.getQuery()``` */
export const getQuery = (): string | null => getApp().getQuery();

/** モバイル対応 ```kintone.app.getQueryCondition()``` */
export const getQueryCondition = (): string | null => getApp().getQueryCondition();

/** モバイル対応 ```kintone.app.record.get()``` */
export const getCurrentRecord = (): { record: KintoneRecord } => getApp().record.get();

/** モバイル対応 ```kintone.app.record.set()``` */
export const setCurrentRecord = (record: { record: KintoneRecord }): void =>
  getApp().record.set(record);

/** モバイル対応 ```kintone.app.record.setFieldShown()``` */
export const setFieldShown = (code: string, visible: boolean): void =>
  getApp().record.setFieldShown(String(code), visible);

/** 一覧に応じて、ツールバー部分を優先してヘッダー要素を返します */
export const getHeaderSpace = (eventType: string): HTMLElement | null => {
  if (isMobile(eventType)) {
    kintone.mobile.app.getHeaderSpaceElement();
  } else if (!~eventType.indexOf('index')) {
    return kintone.app.record.getHeaderMenuSpaceElement();
  }
  return kintone.app.getHeaderMenuSpaceElement();
};

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
