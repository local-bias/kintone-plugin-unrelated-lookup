import { kintoneAPI } from '@konomi-app/kintone-utilities';
import {
  areKintoneFieldValuesEqual,
  isEntity,
  isEntityArray,
  isFileInformation,
  isFileValue,
  isSubtableValue,
} from './utils';

describe('isEntity', () => {
  it('エンティティを正しく判定する', () => {
    const entity = { code: 'user1', name: 'User One' };
    expect(isEntity(entity)).toBe(true);
  });

  it('エンティティでないものを正しく判定する', () => {
    const notEntity: kintoneAPI.field.File['value'][number] = {
      fileKey: 'abc123',
      name: 'file.txt',
      contentType: 'text/plain',
      size: '123',
    };
    expect(isEntity(notEntity)).toBe(false);
  });

  it('エンティティでない数値を正しく判定する', () => {
    const value = 123;
    expect(isEntity(value)).toBe(false);
  });

  it('エンティティでない文字列を正しく判定する', () => {
    const value: kintoneAPI.field.SingleLineText['value'] = 'test';
    expect(isEntity(value)).toBe(false);
  });

  it('エンティティでない配列を正しく判定する', () => {
    const value: kintoneAPI.field.CheckBox['value'] = ['test1', 'test2'];
    expect(isEntity(value)).toBe(false);
  });

  it('エンティティでないnullを正しく判定する', () => {
    expect(isEntity(null)).toBe(false);
  });

  it('エンティティでないundefinedを正しく判定する', () => {
    expect(isEntity(undefined)).toBe(false);
  });

  it('エンティティでない空オブジェクトを正しく判定する', () => {
    expect(isEntity({})).toBe(false);
  });
});

describe('isEntityArray', () => {
  it('エンティティの配列を正しく判定する', () => {
    const entities = [
      { code: 'user1', name: 'User One' },
      { code: 'user2', name: 'User Two' },
    ];
    expect(isEntityArray(entities)).toBe(true);
  });

  it('エンティティでない配列を正しく判定する', () => {
    const notEntities = [{ id: 'user1' }, { id: 'user2' }];
    expect(isEntityArray(notEntities)).toBe(false);
  });
});

describe('isSubtableValue', () => {
  it('サブテーブルの値を正しく判定する', () => {
    const subtableValue = [
      { id: '1', value: { text: 'row1' } },
      { id: '2', value: { text: 'row2' } },
    ];
    expect(isSubtableValue(subtableValue)).toBe(true);
  });

  it('サブテーブルの値でないものを正しく判定する', () => {
    const notSubtableValue = { id: '1', value: { text: 'row1' } };
    expect(isSubtableValue(notSubtableValue)).toBe(false);
  });
});

describe('isFileInformation', () => {
  it('ファイル情報を正しく判定する', () => {
    const fileInfo = { fileKey: 'abc123', name: 'file.txt' };
    expect(isFileInformation(fileInfo)).toBe(true);
  });

  it('ファイル情報でないものを正しく判定する', () => {
    const notFileInfo = { key: 'abc123', filename: 'file.txt' };
    expect(isFileInformation(notFileInfo)).toBe(false);
  });
});

describe('isFileValue', () => {
  it('ファイル情報の配列を正しく判定する', () => {
    const fileValues = [
      { fileKey: 'abc123', name: 'file1.txt' },
      { fileKey: 'def456', name: 'file2.txt' },
    ];
    expect(isFileValue(fileValues)).toBe(true);
  });

  it('ファイル情報の配列でないものを正しく判定する', () => {
    const notFileValues = [{ key: 'abc123', filename: 'file1.txt' }];
    expect(isFileValue(notFileValues)).toBe(false);
  });
});

describe('areKintoneFieldValuesEqual', () => {
  it('同一の文字列値を比較してtrueを返す', () => {
    const a: kintoneAPI.field.SingleLineText['value'] = 'test';
    const b: kintoneAPI.field.Dropdown['value'] = 'test';
    expect(areKintoneFieldValuesEqual(a, b)).toBe(true);
  });

  it('異なる文字列値を比較してfalseを返す', () => {
    const a: kintoneAPI.field.SingleLineText['value'] = 'test1';
    const b: kintoneAPI.field.Dropdown['value'] = 'test2';
    expect(areKintoneFieldValuesEqual(a, b)).toBe(false);
  });

  it('同一の数値を比較してtrueを返す', () => {
    const a: kintoneAPI.field.Number['value'] = '123';
    const b: kintoneAPI.field.Number['value'] = '123';
    expect(areKintoneFieldValuesEqual(a, b)).toBe(true);
  });

  it('異なる数値を比較してfalseを返す', () => {
    const a: kintoneAPI.field.Number['value'] = '123';
    const b: kintoneAPI.field.Number['value'] = '456';
    expect(areKintoneFieldValuesEqual(a, b)).toBe(false);
  });

  it('同一のエンティティを比較してtrueを返す', () => {
    const a: kintoneAPI.field.UserEntity[] = [
      { code: 'user1', name: 'User One' },
      { code: 'user2', name: 'User Two' },
    ];
    const b: kintoneAPI.field.UserEntity[] = [
      { code: 'user1', name: 'User One' },
      { code: 'user2', name: 'User Two' },
    ];
    expect(areKintoneFieldValuesEqual(a, b)).toBe(true);
  });

  it('異なるエンティティを比較してfalseを返す', () => {
    const a: kintoneAPI.field.UserEntity[] = [
      { code: 'user1', name: 'User One' },
      { code: 'user2', name: 'User Two' },
    ];
    const b: kintoneAPI.field.UserEntity[] = [
      { code: 'user1', name: 'User One' },
      { code: 'user3', name: 'User Three' },
    ];
    expect(areKintoneFieldValuesEqual(a, b)).toBe(false);
  });

  it('同一のファイル情報を比較してtrueを返す', () => {
    const a: kintoneAPI.field.File['value'] = [
      { fileKey: 'abc123', name: 'file.txt', contentType: 'text/plain', size: '123' },
    ];
    const b: kintoneAPI.field.File['value'] = [
      { fileKey: 'abc123', name: 'file.txt', contentType: 'text/plain', size: '123' },
    ];
    expect(areKintoneFieldValuesEqual(a, b)).toBe(true);
  });

  it('異なるファイル情報を比較してfalseを返す', () => {
    const a: kintoneAPI.field.File['value'] = [
      { fileKey: 'abc123', name: 'file1.txt', contentType: 'text/plain', size: '123' },
    ];
    const b: kintoneAPI.field.File['value'] = [
      { fileKey: 'def456', name: 'file2.txt', contentType: 'text/plain', size: '456' },
    ];
    expect(areKintoneFieldValuesEqual(a, b)).toBe(false);
  });

  it('エンティティと、エンティティでない値を比較してfalseを返す', () => {
    const a: kintoneAPI.field.UserEntity[] = [
      { code: 'user1', name: 'User One' },
      { code: 'user2', name: 'User Two' },
    ];
    const b = 'test';
    expect(areKintoneFieldValuesEqual(a, b)).toBe(false);
  });
});
