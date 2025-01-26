import { dstAppPropertiesState } from '@/config/states/kintone';
import { isProd } from '@/lib/global';
import { t } from '@/lib/i18n';
import {
  FIELD_TYPES_ENTITY_VALUE,
  isEntityArrayValueField,
  isEntityValueField,
  isStringArrayValueField,
  isStringArrayValueFieldType,
  isStringValueFieldType,
} from '@/lib/kintone-api';
import { store } from '@/lib/store';
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
export const convertFieldValueByTargetType = async (params: {
  condition: PluginCondition;
  destinationFieldType: kintoneAPI.Field['type'];
  destinationFieldCode: string;
  sourceField: kintoneAPI.Field;
}): Promise<{
  value: kintoneAPI.Field['value'] | null;
  dstError?: string;
}> => {
  const { condition, destinationFieldType, destinationFieldCode, sourceField } = params;

  if (destinationFieldType === sourceField.type) {
    return { value: sourceField.value };
  }

  const getDstProperty = async () => {
    const dstProperties = await store.get(dstAppPropertiesState);

    if (condition.type === 'single') {
      return dstProperties[destinationFieldCode] ?? null;
    }
    const dstSubtableProperty = dstProperties[condition.dstSubtableFieldCode];
    if (dstSubtableProperty?.type !== 'SUBTABLE') {
      return null;
    }
    return dstSubtableProperty.fields[destinationFieldCode] ?? null;
  };

  const getDstError = async (errorMessage: string) => {
    const dstFieldProperty = await getDstProperty();
    if (!dstFieldProperty) {
      console.warn('Destination field properties is not found.', destinationFieldCode);
    }
    let dstFieldName = dstFieldProperty?.label ?? destinationFieldCode;
    return `${dstFieldName}: ${errorMessage}`;
  };

  if (
    destinationFieldType === 'CALC' ||
    destinationFieldType === '__ID__' ||
    destinationFieldType === '__REVISION__' ||
    destinationFieldType === 'CREATOR' ||
    destinationFieldType === 'MODIFIER' ||
    destinationFieldType === 'RECORD_NUMBER' ||
    destinationFieldType === 'CREATED_TIME' ||
    destinationFieldType === 'UPDATED_TIME'
  ) {
    const dstError = await getDstError(t('desktop.fieldError.invalidFieldType'));
    return { value: null, dstError };
  }

  if (destinationFieldType === 'NUMBER') {
    const isNumber = (value: any): boolean => value !== null && !isNaN(value);

    if (isEntityArrayValueField(sourceField)) {
      for (const entity of sourceField.value) {
        if (isNumber(entity.code)) {
          return { value: entity.code };
        }
        if (isNumber(entity.name)) {
          return { value: entity.name };
        }
      }
      const dstError = await getDstError(t('desktop.fieldError.invalidNumber'));
      return { value: null, dstError };
    } else if (isEntityValueField(sourceField)) {
      if (isNumber(sourceField.value.code)) {
        return { value: sourceField.value.code };
      }
      if (isNumber(sourceField.value.name)) {
        return { value: sourceField.value.name };
      }
      const dstError = await getDstError(t('desktop.fieldError.invalidNumber'));
      return { value: null, dstError };
    } else if (isStringArrayValueField(sourceField)) {
      const matched = sourceField.value.find((v) => isNumber(v));
      if (matched) {
        return { value: matched };
      }
      const dstError = await getDstError(t('desktop.fieldError.invalidNumber'));
      return { value: null, dstError };
    } else {
      // 🚧 ファイル一覧などのフィールドタイプの条件が抜けているため、追加する必要がある
    }

    const sourceFieldValue = getFieldValueAsString(sourceField);
    if (isNumber(sourceFieldValue)) {
      return { value: sourceFieldValue };
    }
    const dstError = await getDstError(t('desktop.fieldError.invalidNumber'));
    return { value: null, dstError };
  }

  if (
    destinationFieldType === 'DATE' ||
    destinationFieldType === 'DATETIME' ||
    destinationFieldType === 'TIME'
  ) {
    if (
      isStringArrayValueField(sourceField) ||
      isEntityArrayValueField(sourceField) ||
      isEntityValueField(sourceField)
    ) {
      const dstError = await getDstError(t('desktop.fieldError.invalidDate'));
      return { value: null, dstError };
    }

    const sourceFieldValue = sourceField.value;
    if (
      Array.isArray(sourceFieldValue) ||
      sourceFieldValue === null ||
      !Date.parse(sourceFieldValue)
    ) {
      const dstError = await getDstError(t('desktop.fieldError.invalidDate'));
      return { value: null, dstError };
    }

    return { value: sourceFieldValue };
  }

  if (destinationFieldType === 'DROP_DOWN' || destinationFieldType === 'RADIO_BUTTON') {
    const dstFieldProperty = await getDstProperty();
    if (
      !dstFieldProperty ||
      (dstFieldProperty.type !== 'DROP_DOWN' && dstFieldProperty.type !== 'RADIO_BUTTON')
    ) {
      return { value: null };
    }
    const optionValues = Object.values(dstFieldProperty.options).map((option) => option.label);
    if (isEntityArrayValueField(sourceField)) {
      for (const entity of sourceField.value) {
        if (optionValues.includes(entity.code)) {
          return { value: entity.code };
        }
        if (optionValues.includes(entity.name)) {
          return { value: entity.name };
        }
      }
      const dstError = await getDstError(t('desktop.fieldError.invalidOption'));
      return { value: null, dstError };
    } else if (isEntityValueField(sourceField)) {
      if (optionValues.includes(sourceField.value.code)) {
        return { value: sourceField.value.code };
      }
      if (optionValues.includes(sourceField.value.name)) {
        return { value: sourceField.value.name };
      }
      const dstError = await getDstError(t('desktop.fieldError.invalidOption'));
      return { value: null, dstError };
    } else if (isStringArrayValueField(sourceField)) {
      const matched = sourceField.value.find((v) => optionValues.includes(v));
      if (matched) {
        return { value: matched };
      }
      const dstError = await getDstError(t('desktop.fieldError.invalidOption'));
      return { value: null, dstError };
    } else {
      // 🚧 ファイル一覧などのフィールドタイプの条件が抜けているため、追加する必要がある
    }

    const sourceFieldValue = getFieldValueAsString(sourceField);

    if (optionValues.includes(sourceFieldValue)) {
      return { value: sourceFieldValue };
    }
    const dstError = await getDstError(t('desktop.fieldError.invalidOption'));
    return { value: null, dstError };
  }

  // 💡 ここまでのコンバート処理で対象とならなかったデータについては
  // フィールドタイプではなく、フィールドの値による変換を行う

  if (isStringValueFieldType(destinationFieldType)) {
    return {
      value: getFieldValueAsString(sourceField),
    };
  }
  if (isStringArrayValueFieldType(destinationFieldType)) {
    if (isStringArrayValueField(sourceField)) {
      return {
        value: sourceField.value,
      };
    }
    return {
      value: [getFieldValueAsString(sourceField)],
    };
  }
  if (FIELD_TYPES_ENTITY_VALUE.includes(destinationFieldType)) {
    if (isEntityValueField(sourceField)) {
      return { value: sourceField.value };
    }
    if (isEntityArrayValueField(sourceField)) {
      return { value: sourceField.value[0]! };
    }
  }
  return { value: sourceField.value };
};
