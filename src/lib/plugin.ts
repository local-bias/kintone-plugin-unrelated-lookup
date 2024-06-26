import { produce } from 'immer';
import { restoreStorage } from '@konomi-app/kintone-utilities';
import { PLUGIN_ID } from './global';

export const getNewCondition = (): Plugin.Condition => ({
  srcAppId: '',
  srcSpaceId: null,
  isSrcAppGuestSpace: false,
  srcField: '',
  dstField: '',
  copies: [{ from: '', to: '' }],
  sees: [''],
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
  version: 3,
  conditions: [getNewCondition()],
});

/**
 * 古いバージョンの設定情報を新しいバージョンに変換します
 * @param anyConfig 過去全てのバージョンを含む、プラグインがアプリ単位で保存する設定情報
 * @returns 新しいバージョンの設定情報
 */
export const migrateConfig = (anyConfig: Plugin.AnyConfig): Plugin.Config => {
  const { version } = anyConfig;
  switch (version) {
    case 2:
      return {
        ...anyConfig,
        version: 3,
        conditions: anyConfig.conditions.map((condition) => ({
          ...condition,
          srcSpaceId: null,
          isSrcAppGuestSpace: false,
        })),
      };
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
      condition.sees = condition.sees.filter((field) => field);
    }
  });
  return cleansed;
};

/**
 * プラグインの設定情報を復元します
 */
export const restorePluginConfig = (params?: { cleansed?: boolean }): Plugin.Config => {
  const { cleansed = false } = params ?? {};
  const config = restoreStorage<Plugin.Config>(PLUGIN_ID) ?? createConfig();
  const migrated = migrateConfig(config);
  return cleansed ? cleanse(migrated) : migrated;
};

export const getUpdatedStorage = <T extends keyof Plugin.Condition>(
  storage: Plugin.Config,
  props: {
    conditionIndex: number;
    key: T;
    value: Plugin.Condition[T];
  }
) => {
  const { conditionIndex, key, value } = props;
  return produce(storage, (draft) => {
    draft.conditions[conditionIndex][key] = value;
  });
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
