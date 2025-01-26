import { store } from '@/lib/store';
import { PluginCondition } from '@/schema/plugin-config';
import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { currentAppPropertiesAtom } from '../states';
import { t } from '@/lib/i18n';

export const applyError = async (params: {
  condition: PluginCondition;
  event: kintoneAPI.js.Event;
  error: any;
  rowIndex?: number;
}) => {
  const { condition, event, error, rowIndex } = params;
  const appProperties = await store.get(currentAppPropertiesAtom);

  let fieldName = '';
  let targetField: kintoneAPI.Field | null = null;
  if (condition.type === 'single') {
    targetField = event.record[condition.dstField];
    const property = Object.values(appProperties).find(
      (property) => property.code === condition.dstField
    );
    if (property) {
      fieldName = property.label;
    }
  } else {
    const subtable = event.record[condition.dstSubtableFieldCode] as kintoneAPI.field.Subtable;
    const subtableProperty = Object.values(appProperties).find(
      (property) => property.code === condition.dstSubtableFieldCode
    ) as kintoneAPI.property.Subtable | undefined;
    if (subtableProperty && subtable) {
      targetField = subtable.value[rowIndex!].value[condition.dstInsubtableFieldCode];
      const property = Object.values(subtableProperty.fields).find(
        (property) => property.code === condition.dstInsubtableFieldCode
      );
      if (property) {
        fieldName = property.label;
      }
    }
  }

  if (typeof error === 'string') {
    //@ts-expect-error dts-genの型情報に`error`プロパティが存在しないため
    targetField.error = error;
    event.error = t('desktop.eventError.lookupFailed', fieldName, error);
  } else if (error instanceof Error || 'message' in error) {
    //@ts-expect-error dts-genの型情報に`error`プロパティが存在しないため
    targetField.error = error.message;
    event.error = t('desktop.eventError.lookupFailed', fieldName, error.message);
  } else {
    //@ts-expect-error dts-genの型情報に`error`プロパティが存在しないため
    targetField.error = t('desktop.fieldError.unknownError');
    event.error = t('desktop.eventError.lookupFailedUnknown', fieldName);
  }
};
