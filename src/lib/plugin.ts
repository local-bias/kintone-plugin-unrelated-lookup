import { produce } from 'immer';
import { restoreStorage } from '@konomi-app/kintone-utilities';
import { PLUGIN_ID } from './global';
import { nanoid } from 'nanoid';

export const getNewCondition = (): Plugin.Condition => ({
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
  query: '',
  isCaseSensitive: false,
  isKatakanaSensitive: false,
  isZenkakuEisujiSensitive: false,
  isHankakuKatakanaSensitive: false,
});

/**
 * プラグインの設定情報のひな形を返却します
 */
export const createConfig = (): Plugin.Config => ({
  version: 5,
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
export const migrateConfig = (anyConfig: Plugin.AnyConfig): Plugin.Config => {
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
    default:
      return anyConfig;
  }
};

/**
 * プラグイン設定時に残った、不要な設定情報を整理します
 * @param target プラグインの設定情報
 * @returns 整理したプラグインの設定情報
 */
export const cleanse = (target: Plugin.Config): Plugin.Config => {
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
export const restorePluginConfig = (): Plugin.Config => {
  const config = restoreStorage<Plugin.Config>(PLUGIN_ID) ?? createConfig();
  return migrateConfig(config);
};

export const getConditionField = <T extends keyof Plugin.Condition>(
  storage: Plugin.Config,
  props: {
    conditionIndex: number;
    key: T;
    defaultValue: NonNullable<Plugin.Condition[T]>;
  }
): NonNullable<Plugin.Condition[T]> => {
  const { conditionIndex, key, defaultValue } = props;
  if (!storage.conditions[conditionIndex]) {
    return defaultValue;
  }
  return storage.conditions[conditionIndex][key] ?? defaultValue;
};
