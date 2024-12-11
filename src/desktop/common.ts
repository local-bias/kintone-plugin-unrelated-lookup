import {
  FIELD_TYPES_ENTITY_VALUE,
  FIELD_TYPES_META,
  FIELD_TYPES_SYSTEM,
  isEntityArrayValueField,
  isEntityValueField,
  isStringArrayValueField,
  isStringArrayValueFieldType,
  isStringValueFieldType,
} from '@/lib/kintone-api';
import { PluginCondition } from '@/schema/plugin-config';
import { getFieldValueAsString, kintoneAPI } from '@konomi-app/kintone-utilities';

export const getDstField = (condition: PluginCondition, record: kintoneAPI.RecordData) => {
  if (condition.type !== 'single') {
    throw new Error(`type is not single: ${condition.id}`);
  }
  const dstField = record[condition.dstField];
  if (!dstField) {
    throw new Error(`dstField not found: ${condition.dstField}`);
  }
  return dstField;
};

/**
 * 値を反映する先のフィールドタイプに応じて、変換した参照元のフィールドの値を返します。
 * @param params
 */
export const convertFieldValueByTargetType = (params: {
  targetFieldType: Exclude<
    kintoneAPI.Field['type'],
    (typeof FIELD_TYPES_SYSTEM)[number] | (typeof FIELD_TYPES_META)[number]
  >;
  sourceField: kintoneAPI.Field;
}): kintoneAPI.Field['value'] => {
  const { targetFieldType, sourceField } = params;

  if (isStringValueFieldType(targetFieldType)) {
    return getFieldValueAsString(sourceField);
  }
  if (isStringArrayValueFieldType(targetFieldType)) {
    if (isStringArrayValueField(sourceField)) {
      return sourceField.value;
    }
    return [getFieldValueAsString(sourceField)];
  }
  if (FIELD_TYPES_ENTITY_VALUE.includes(targetFieldType)) {
    if (isEntityValueField(sourceField)) {
      return sourceField.value;
    }
    if (isEntityArrayValueField(sourceField)) {
      return sourceField.value[0];
    }
  }
  return sourceField.value;
};
