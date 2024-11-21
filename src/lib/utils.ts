import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isEntity = (
  value: unknown
): value is
  | kintoneAPI.field.UserEntity
  | kintoneAPI.field.GroupEntity
  | kintoneAPI.field.OrganizationEntity => {
  return !!value && typeof value === 'object' && 'code' in value && 'name' in value;
};

export const isEntityArray = (
  value: unknown
): value is
  | kintoneAPI.field.UserEntity[]
  | kintoneAPI.field.GroupEntity[]
  | kintoneAPI.field.OrganizationEntity[] => {
  return !!value && Array.isArray(value) && value.every(isEntity);
};

export const isSubtableValue = (value: unknown): value is kintoneAPI.field.Subtable['value'] => {
  return (
    !!value &&
    Array.isArray(value) &&
    value.every((row) => {
      return !!row && typeof row === 'object' && 'value' in row;
    })
  );
};

export const isFileInformation = (
  value: unknown
): value is kintoneAPI.field.File['value'][number] => {
  return !!value && typeof value === 'object' && 'fileKey' in value && 'name' in value;
};

export const isFileValue = (value: unknown): value is kintoneAPI.field.File['value'] => {
  return !!value && Array.isArray(value) && value.every(isFileInformation);
};

export const areKintoneFieldValuesEqual = (
  a: kintoneAPI.Field['value'],
  b: kintoneAPI.Field['value']
): boolean => {
  if (a === null && b === null) {
    return true;
  }
  if (isSubtableValue(a) || isSubtableValue(b)) {
    return false;
  }

  const aIsFileValue = isFileValue(a);
  const bIsFileValue = isFileValue(b);

  if (aIsFileValue && bIsFileValue) {
    return a.length === b.length && a.every((v, i) => v.fileKey === b[i].fileKey);
  }
  if ((aIsFileValue && !bIsFileValue) || (!aIsFileValue && bIsFileValue)) {
    return false;
  }

  const aIsEntity = isEntity(a);
  const bIsEntity = isEntity(b);
  const aIsArray = Array.isArray(a);
  const bIsArray = Array.isArray(b);
  const aIsEntityArray = isEntityArray(a);
  const bIsEntityArray = isEntityArray(b);

  if (aIsEntityArray && bIsEntityArray) {
    return a.length === b.length && a.every((v, i) => areKintoneFieldValuesEqual(v, b[i]));
  }
  if (aIsEntityArray && !bIsEntityArray && !bIsFileValue) {
    if (!bIsArray) {
      return false;
    }
    return a.length === b.length && a.every((v, i) => areKintoneFieldValuesEqual(v, b[i]));
  }
  if (!aIsEntityArray && !aIsFileValue && bIsEntityArray) {
    if (!aIsArray) {
      return false;
    }
    return a.length === b.length && a.every((v, i) => areKintoneFieldValuesEqual(v, b[i]));
  }
  if (aIsEntity && bIsEntity) {
    return a.code === b.code;
  }
  if (!aIsFileValue && !bIsFileValue && aIsArray && bIsArray) {
    return a.length === b.length && a.every((v, i) => areKintoneFieldValuesEqual(v, b[i]));
  }
  return a === b;
};
