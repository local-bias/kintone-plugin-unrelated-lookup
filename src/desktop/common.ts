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

export const getDstSubtable = (params: {
  condition: PluginCondition;
  record: kintoneAPI.RecordData;
}): kintoneAPI.field.Subtable | null => {
  const { condition, record } = params;
  if (condition.type === 'single') {
    return null;
  }
  const field = record[condition.dstSubtableFieldCode];
  if (!field || field.type !== 'SUBTABLE') {
    return null;
  }
  return field;
};

/**
 * レコードから目的のフィールドを取得します。
 * @param params - パラメーター
 * @param params.condition - プラグイン設定の条件
 * @param params.record - kintoneレコードデータ
 * @param params.rowIndex - サブテーブルの行インデックス（サブテーブルフィールドの場合）
 * @returns フィールドオブジェクト。フィールドが見つからない場合はnull
 *
 * @example
 * // 通常フィールドの場合
 * getDstField({ condition, record });
 *
 * // サブテーブルフィールドの場合
 * getDstField({ condition, record, rowIndex: 0 });
 */
export const getDstField = (params: {
  condition: PluginCondition;
  record: kintoneAPI.RecordData;
  rowIndex?: number;
}): kintoneAPI.Field | null => {
  const { condition, record, rowIndex } = params;
  if (condition.type === 'single') {
    return record[condition.dstField] ?? null;
  }
  if (rowIndex === undefined) {
    return null;
  }

  const subtable = getDstSubtable({ condition, record });
  if (!subtable) {
    return null;
  }

  const subtableRow = subtable.value[rowIndex];
  if (subtableRow) {
    return subtableRow.value[condition.dstInsubtableFieldCode] ?? null;
  }
  return null;
};

/**
 * 値を反映する先のフィールドタイプに応じて、変換した参照元のフィールドの値を返します。
 * @param params
 */
export const convertFieldValueByTargetType = (params: {
  targetFieldType: kintoneAPI.Field['type'];
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
      return sourceField.value[0]!;
    }
  }
  return sourceField.value;
};
