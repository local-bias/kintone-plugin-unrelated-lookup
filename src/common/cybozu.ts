import { Cybozu } from '../types/cybozu';

declare const cybozu: Cybozu;

const getSchema = () => cybozu.data.page.SCHEMA_DATA || cybozu.data.page.FORM_DATA.schema;

export const getFields = () => {
  const schema = getSchema();

  return Object.values(schema.table.fieldList);
};

export const getSubtableFields = (subtableCode: string) => {
  const schema = getSchema();

  const subTables = Object.values(schema.subTable);

  for (const subTable of subTables) {
    if (subTable.var === subtableCode) {
      return Object.values(subTable.fieldList);
    }
  }

  return null;
};

export const getFieldMap = () => {
  const fields = getFields();

  return new Map(fields.map((field) => [field.var, field]));
};

export const getFieldId = (code: string) => {
  const fields = getFields();

  for (const field of fields) {
    if (field.var === code) {
      return field.id;
    }
  }
  return null;
};
