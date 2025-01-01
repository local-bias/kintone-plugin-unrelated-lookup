import { kintoneAPI } from '@konomi-app/kintone-utilities/dist/types/api';

export const FIELD_TYPES_META = [
  '__ID__',
  '__REVISION__',
] as const satisfies kintoneAPI.Field['type'][];

/** kintoneアプリに初期状態で存在するフィールドタイプ */
export const FIELD_TYPES_SYSTEM = [
  'RECORD_NUMBER',
  'UPDATED_TIME',
  'CREATOR',
  'CREATED_TIME',
  'CATEGORY',
  'MODIFIER',
  'STATUS',
] as const satisfies kintoneAPI.FieldPropertyType[];

/** クエリーのフィールドとして使用する際に、値をエスケープする必要があるフィールドタイプ */
export const FIELD_TYPES_REQUIRES_ESCAPE = [
  'SINGLE_LINE_TEXT',
  'MULTI_LINE_TEXT',
  'RICH_TEXT',
  'CHECK_BOX',
  'RADIO_BUTTON',
  'DROP_DOWN',
  'MULTI_SELECT',
  'STATUS',
] as const satisfies kintoneAPI.Field['type'][];

/** LIKE検索を使用することができるフィールド */
export const FIELD_TYPES_TEXT_SEARCHABLE = [
  'SINGLE_LINE_TEXT',
  'LINK',
  'MULTI_LINE_TEXT',
  'RICH_TEXT',
  'FILE',
] as const satisfies kintoneAPI.Field['type'][];

/** IN検索を使用することができるフィールド */
export const FIELD_TYPES_MULTIPLE_SEARCHABLE = [
  'CREATOR',
  'MODIFIER',
  'CHECK_BOX',
  'RADIO_BUTTON',
  'DROP_DOWN',
  'MULTI_SELECT',
  'USER_SELECT',
  'ORGANIZATION_SELECT',
  'GROUP_SELECT',
] as const satisfies kintoneAPI.Field['type'][];

/** フィールドの値が文字列となるフィールドタイプ */
export const FIELD_TYPES_STRING_VALUE = [
  '__ID__',
  '__REVISION__',
  'RECORD_NUMBER',
  'CREATED_TIME',
  'UPDATED_TIME',
  'NUMBER',
  'CALC',
  'SINGLE_LINE_TEXT',
  'MULTI_LINE_TEXT',
  'RICH_TEXT',
  'LINK',
  'RADIO_BUTTON',
  'DROP_DOWN',
  'DATE',
  'TIME',
  'DATETIME',
  'STATUS',
] as const satisfies kintoneAPI.Field['type'][];

/** フィールドの値が文字列の配列になるフィールドタイプ */
export const FIELD_TYPES_STRING_ARRAY_VALUE = [
  'CHECK_BOX',
  'MULTI_SELECT',
  'CATEGORY',
] as const satisfies kintoneAPI.Field['type'][];

/** フィールドの値が`{ code: string; name: string; }`になるフィールドタイプ */
export const FIELD_TYPES_ENTITY_VALUE = ['CREATOR', 'MODIFIER'];

/** フィールドの値が`{ code: string; name: string; }[]`になるフィールドタイプ */
export const FIELD_TYPES_ENTITY_ARRAY_VALUE = [
  'USER_SELECT',
  'ORGANIZATION_SELECT',
  'GROUP_SELECT',
  'STATUS_ASSIGNEE',
];

export const isMetaFieldType = (
  type: kintoneAPI.Field['type']
): type is (typeof FIELD_TYPES_META)[number] => {
  // @ts-expect-error FIELD_TYPES_METAには`field.type`の型が含まれている
  return FIELD_TYPES_META.includes(type);
};

export const isSystemFieldType = (
  type: kintoneAPI.Field['type']
): type is (typeof FIELD_TYPES_SYSTEM)[number] => {
  // @ts-expect-error FIELD_TYPES_SYSTEMには`field.type`の型が含まれている
  return FIELD_TYPES_SYSTEM.includes(type);
};

/** クエリーのフィールドとして使用する際に、値をエスケープする必要があるフィールドタイプ */
export const isEscapeRequiredFieldType = (
  type: kintoneAPI.Field['type']
): type is (typeof FIELD_TYPES_REQUIRES_ESCAPE)[number] => {
  // @ts-expect-error FIELD_TYPES_CLEARABLEには`field.type`の型が含まれている
  return FIELD_TYPES_REQUIRES_ESCAPE.includes(type);
};
export const isEscapeRequiredField = (
  field: kintoneAPI.Field
): field is
  | kintoneAPI.field.SingleLineText
  | kintoneAPI.field.MultiLineText
  | kintoneAPI.field.RichText
  | kintoneAPI.field.CheckBox
  | kintoneAPI.field.RadioButton
  | kintoneAPI.field.Dropdown
  | kintoneAPI.field.MultiSelect
  | kintoneAPI.field.Status => {
  // @ts-expect-error FIELD_TYPES_REQUIRES_ESCAPEには`field.type`の型が含まれている
  return FIELD_TYPES_REQUIRES_ESCAPE.includes(field.type);
};

export const isTextSearchableFieldType = (
  type: unknown
): type is (typeof FIELD_TYPES_TEXT_SEARCHABLE)[number] => {
  if (typeof type !== 'string') {
    return false;
  }
  // @ts-expect-error FIELD_TYPES_TEXT_SEARCHABLEには`field.type`の型が含まれている
  return FIELD_TYPES_TEXT_SEARCHABLE.includes(type);
};
export const isTextSearchableField = (
  field: kintoneAPI.Field
): field is
  | kintoneAPI.field.SingleLineText
  | kintoneAPI.field.MultiLineText
  | kintoneAPI.field.RichText
  | kintoneAPI.field.Link
  | kintoneAPI.field.File => {
  // @ts-expect-error FIELD_TYPES_TEXT_SEARCHABLEには`field.type`の型が含まれている
  return FIELD_TYPES_TEXT_SEARCHABLE.includes(field.type);
};

export const isMultipleSearchableFieldType = (
  type: unknown
): type is (typeof FIELD_TYPES_MULTIPLE_SEARCHABLE)[number] => {
  if (typeof type !== 'string') {
    return false;
  }
  // @ts-expect-error FIELD_TYPES_MULTIPLE_SEARCHABLEには`field.type`の型が含まれている
  return FIELD_TYPES_MULTIPLE_SEARCHABLE.includes(type);
};

export const isStringValueFieldType = (
  type: kintoneAPI.Field['type']
): type is (typeof FIELD_TYPES_STRING_VALUE)[number] => {
  // @ts-expect-error FIELD_TYPES_STRING_VALUEには`field.type`の型が含まれている
  return FIELD_TYPES_STRING_VALUE.includes(type);
};

export const isStringArrayValueFieldType = (
  type: kintoneAPI.Field['type']
): type is (typeof FIELD_TYPES_STRING_ARRAY_VALUE)[number] => {
  // @ts-expect-error FIELD_TYPES_STRING_ARRAY_VALUEには`field.type`の型が含まれている
  return FIELD_TYPES_STRING_ARRAY_VALUE.includes(type);
};

/** 対象フィールドが、`value`プロパティに文字列を持つ場合は`true`を返します */
export const isStringValueField = (
  field: kintoneAPI.Field
): field is
  | kintoneAPI.field.SingleLineText
  | kintoneAPI.field.MultiLineText
  | kintoneAPI.field.RichText
  | kintoneAPI.field.Link
  | kintoneAPI.field.RadioButton
  | kintoneAPI.field.Dropdown
  | kintoneAPI.field.Date
  | kintoneAPI.field.Time
  | kintoneAPI.field.DateTime
  | kintoneAPI.field.Status => {
  // @ts-expect-error FIELD_TYPES_STRING_VALUEには`field.type`の型が含まれている
  return FIELD_TYPES_STRING_VALUE.includes(field.type);
};

export const isStringArrayValueField = (
  field: kintoneAPI.Field
): field is
  | kintoneAPI.field.CheckBox
  | kintoneAPI.field.MultiSelect
  | kintoneAPI.field.Category => {
  // @ts-expect-error FIELD_TYPES_STRING_ARRAY_VALUEには`field.type`の型が含まれている
  return FIELD_TYPES_STRING_ARRAY_VALUE.includes(field.type);
};

export const isEntityValueField = (
  field: kintoneAPI.Field
): field is kintoneAPI.field.Creator | kintoneAPI.field.Modifier => {
  return FIELD_TYPES_ENTITY_VALUE.includes(field.type);
};

export const isEntityArrayValueField = (
  field: kintoneAPI.Field
): field is
  | kintoneAPI.field.UserSelect
  | kintoneAPI.field.OrganizationSelect
  | kintoneAPI.field.GroupSelect
  | kintoneAPI.field.StatusAssignee => {
  return FIELD_TYPES_ENTITY_ARRAY_VALUE.includes(field.type);
};

/**
 * APIから取得したフィールド情報から、指定した関数の条件に当てはまるフィールドのみを返却します
 *
 * @param properties APIから取得したフィールド情報
 * @param callback 絞り込み条件
 * @returns 条件に当てはまるフィールド
 */
export const filterFieldProperties = (
  properties: kintoneAPI.FieldProperties,
  callback: (field: kintoneAPI.FieldProperty) => boolean
): kintoneAPI.FieldProperties => {
  const filtered = Object.entries(properties).filter(([, value]) => callback(value));

  const reduced = filtered.reduce<kintoneAPI.FieldProperties>(
    (acc, [key, value]) => ({ ...acc, [key]: value }),
    {}
  );

  return reduced;
};

/**
 * APIから取得したフィールド情報から、指定したフィールドタイプを除いたフィールド一覧を返却します
 *
 * @param properties APIから取得したフィールド情報
 * @param omittingTypes 除外するフィールドタイプ
 * @returns 指定したフィールドタイプを除いた一覧
 */
export const omitFieldProperties = (
  properties: kintoneAPI.FieldProperties,
  omittingTypes: kintoneAPI.FieldPropertyType[]
): kintoneAPI.FieldProperties => {
  return filterFieldProperties(properties, (property) => !omittingTypes.includes(property.type));
};

/** 対象レコードの各フィールドから、指定文字列に一致するフィールドが１つでもあればTrueを返します */
export const someRecord = (record: kintoneAPI.RecordData, searchValue: string): boolean => {
  return Object.values(record).some((field) => someFieldValue(field, searchValue));
};

export const someFieldValue = (field: kintoneAPI.RecordData[string], searchValue: string) => {
  if (!searchValue) {
    return true;
  }

  switch (field.type) {
    case 'CREATOR':
    case 'MODIFIER':
      return ~field.value.name.indexOf(searchValue);

    case 'CHECK_BOX':
    case 'MULTI_SELECT':
    case 'CATEGORY':
      return field.value.some((value) => ~value.indexOf(searchValue));

    case 'USER_SELECT':
    case 'ORGANIZATION_SELECT':
    case 'GROUP_SELECT':
    case 'STATUS_ASSIGNEE':
      return field.value.some(({ name }) => ~name.indexOf(searchValue));

    case 'FILE':
      return field.value.some(({ name }) => ~name.indexOf(searchValue));

    case 'SUBTABLE':
      return field.value.some(({ value }) => someRecord(value, searchValue));

    default:
      return field.value && ~field.value.indexOf(searchValue);
  }
};

export const getEscapedQueryValue = (value: string): string => {
  return value.replace(/\\/, '\\\\').replace(`"`, `\\"`);
};

export const getQueryValue = (field: kintoneAPI.Field): string | string[] => {
  switch (field.type) {
    case 'CHECK_BOX':
    case 'MULTI_SELECT': {
      return field.value.map((value) => `"${getEscapedQueryValue(value)}"`);
    }
    case 'CATEGORY': {
      return field.value.map((value) => `"${value}"`);
    }
    case 'USER_SELECT':
    case 'ORGANIZATION_SELECT':
    case 'GROUP_SELECT':
    case 'STATUS_ASSIGNEE': {
      return field.value.map(({ code }) => `"${code}"`);
    }
    case 'FILE': {
      return field.value.map(({ name }) => `"${name}"`);
    }
    case 'MODIFIER':
    case 'CREATOR': {
      return `"${field.value.code}"`;
    }
    case 'SINGLE_LINE_TEXT':
    case 'MULTI_LINE_TEXT':
    case 'RICH_TEXT':
    case 'RADIO_BUTTON':
    case 'DROP_DOWN':
    case 'STATUS': {
      return `"${getEscapedQueryValue(field.value ?? '')}"`;
    }
    case 'SUBTABLE': {
      throw new Error('サブテーブルの値はクエリーに使用できません');
    }
    default: {
      return `"${field.value ?? ''}"`;
    }
  }
};
