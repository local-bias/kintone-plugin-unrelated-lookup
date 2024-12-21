import {
  AnyConfig,
  LatestPluginConditionSchema,
  PluginCondition,
  PluginConfig,
} from '@/schema/plugin-config';
import { restorePluginConfig as restore } from '@konomi-app/kintone-utilities';
import { produce } from 'immer';
import { nanoid } from 'nanoid';
import { PLUGIN_ID } from './global';

export const validateCondition = (condition: unknown): PluginCondition => {
  return LatestPluginConditionSchema.parse(condition);
};

export const getNewCondition = (): PluginCondition => ({
  id: nanoid(),
  type: 'single',
  srcAppId: '',
  srcSpaceId: null,
  isSrcAppGuestSpace: false,
  srcField: '',
  dstField: '',
  copies: [{ from: '', to: '' }],
  displayFields: [
    {
      id: nanoid(),
      fieldCode: '',
      isLookupField: false,
    },
  ],
  sortCriteria: [{ fieldCode: '', order: 'asc' }],
  enablesCache: true,
  enablesValidation: false,
  autoLookup: true,
  saveAndLookup: false,
  filterMode: 'freeWord',
  filterQuery: '',
  filterConditionType: 'and',
  filterConditions: [
    {
      fieldCode: '',
      operator: 'equal',
      value: {
        type: 'single',
        value: '',
      },
    },
  ],
  isCaseSensitive: false,
  isKatakanaSensitive: false,
  isZenkakuEisujiSensitive: false,
  isHankakuKatakanaSensitive: false,
  dstSubtableFieldCode: '',
  dstInsubtableFieldCode: '',
  insubtableCopies: [{ from: '', to: '' }],
  isAutoCompletionEnabled: true,
  dynamicConditions: [
    {
      type: 'include',
      isFuzzySearchEnabled: true,
      srcAppFieldCode: '',
      dstAppFieldCode: '',
    },
  ],
  isFailSoftEnabled: true,
});

/**
 * プラグインの設定情報のひな形を返却します
 */
export const createConfig = (): PluginConfig => ({
  version: 9,
  common: {},
  conditions: [getNewCondition()],
});

/**
 * 古いバージョンの設定情報を新しいバージョンに変換します
 * 各バージョンは次のバージョンへの変換処理を持ち、再帰的なアクセスによって最新のバージョンに変換されます
 *
 * @param anyConfig 保存されている設定情報
 * @returns 新しいバージョンの設定情報
 */
export const migrateConfig = (anyConfig: AnyConfig): PluginConfig => {
  const { version } = anyConfig;
  switch (version) {
    case undefined:
    case 1:
      return migrateConfig({
        ...anyConfig,
        version: 2,
        conditions: anyConfig.conditions.map((condition) => ({
          ...condition,
          isCaseSensitive: !(condition.ignoresLetterCase ?? true),
          isKatakanaSensitive: !(condition.ignoresKatakana ?? true),
          isZenkakuEisujiSensitive: !(condition.ignoresZenkakuEisuji ?? true),
          isHankakuKatakanaSensitive: !(condition.ignoresHankakuKatakana ?? true),
        })),
      });
    case 2:
      return migrateConfig({
        ...anyConfig,
        version: 3,
        conditions: anyConfig.conditions.map((condition) => ({
          srcSpaceId: null,
          isSrcAppGuestSpace: false,
          ...condition,
        })),
      });
    case 3:
      return migrateConfig({
        common: {},
        ...anyConfig,
        version: 4,
        conditions: anyConfig.conditions.map((condition) => ({
          id: nanoid(),
          ...condition,
        })),
      });
    case 4:
      return migrateConfig({
        ...anyConfig,
        version: 5,
        conditions: anyConfig.conditions.map((condition) => ({
          ...condition,
          type: 'single',
          sortCriteria: [{ fieldCode: '', order: 'asc' }],
          displayFields: [
            {
              id: nanoid(),
              fieldCode: condition.srcField,
              isLookupField: true,
            },
            ...condition.sees.map((fieldCode) => ({
              id: nanoid(),
              fieldCode,
              isLookupField: false,
            })),
          ],
        })),
      });
    case 5:
      return migrateConfig({
        version: 6,
        common: anyConfig.common,
        conditions: anyConfig.conditions.map((condition) => ({
          ...condition,
          dstSubtableFieldCode: '',
          dstInsubtableFieldCode: '',
          insubtableCopies: [],
        })),
      });
    case 6:
      return migrateConfig({
        version: 7,
        common: anyConfig.common,
        conditions: anyConfig.conditions.map((condition) => ({
          ...condition,
          isAutoCompletionEnabled: true,
          dynamicCondition: [
            {
              type: 'include',
              isFuzzySearchEnabled: true,
              sourceFieldCode: '',
              targetFieldCode: '',
            },
          ],
        })),
      });
    case 7:
      return migrateConfig({
        version: 8,
        common: anyConfig.common,
        conditions: anyConfig.conditions.map((condition) => ({
          ...condition,
          dynamicConditions: condition.dynamicCondition.map((dynamicCondition) => ({
            ...dynamicCondition,
            srcAppFieldCode: dynamicCondition.sourceFieldCode,
            dstAppFieldCode: dynamicCondition.targetFieldCode,
          })),
        })),
      });
    case 8:
      return migrateConfig({
        version: 9,
        common: anyConfig.common,
        conditions: anyConfig.conditions.map((condition) => ({
          ...condition,
          filterMode: 'freeWord',
          filterQuery: condition.query ?? '',
          filterConditionType: 'and',
          filterConditions: [
            {
              fieldCode: '',
              operator: 'equal',
              value: {
                type: 'single',
                value: '',
              },
            },
          ],
          isFailSoftEnabled: true,
        })),
      });
    case 9:
    default:
      return anyConfig;
  }
};

/**
 * プラグイン設定時に残った、不要な設定情報を整理します
 * @param target プラグインの設定情報
 * @returns 整理したプラグインの設定情報
 */
export const cleanse = (target: PluginConfig): PluginConfig => {
  const cleansed = produce(target, (draft) => {
    for (const condition of draft.conditions) {
      condition.copies = condition.copies.filter(({ from, to }) => from && to);
      condition.displayFields = condition.displayFields.filter((field) => !!field.fieldCode);
      condition.sortCriteria = condition.sortCriteria.filter(({ fieldCode }) => !!fieldCode);
    }
  });
  return cleansed;
};

/**
 * プラグインの設定情報を復元します
 */
export const restorePluginConfig = (): PluginConfig => {
  const config = restore<PluginConfig>(PLUGIN_ID) ?? createConfig();
  return migrateConfig(config);
};

export const getConditionField = <T extends keyof PluginCondition>(
  storage: PluginConfig,
  props: {
    conditionIndex: number;
    key: T;
    defaultValue: NonNullable<PluginCondition[T]>;
  }
): NonNullable<PluginCondition[T]> => {
  const { conditionIndex, key, defaultValue } = props;
  if (!storage.conditions[conditionIndex]) {
    return defaultValue;
  }
  return storage.conditions[conditionIndex][key] ?? defaultValue;
};
