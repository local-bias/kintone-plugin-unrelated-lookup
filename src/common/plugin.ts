import { produce } from 'immer';
import { restoreStorage } from '@konomi-app/kintone-utilities';
import { PLUGIN_ID } from './global';

export const getNewCondition = (): Plugin.Condition => ({
  srcAppId: '',
  srcField: '',
  dstField: '',
  copies: [{ from: '', to: '' }],
  sees: [''],
  enablesCache: true,
  enablesValidation: false,
  autoLookup: true,
  saveAndLookup: false,
  query: '',
  ignoresLetterCase: true,
  ignoresKatakana: true,
  ignoresZenkakuEisuji: true,
  ignoresHankakuKatakana: true,
});

/**
 * プラグインの設定情報のひな形を返却します
 */
export const createConfig = (): Plugin.Config => ({
  version: 1,
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
    case undefined:
    case 1:
      return anyConfig;
    default:
      return anyConfig;
  }
};

/**
 * プラグイン設定時に残った、不要な設定情報を整理します
 * @param target プラグインの設定情報
 * @returns 整理したプラグインの設定情報
 */
const cleanse = (target: Plugin.Config): Plugin.Config => {
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
export const restorePluginConfig = (): Plugin.Config => {
  const config = restoreStorage<Plugin.Config>(PLUGIN_ID) ?? createConfig();
  return cleanse(migrateConfig(config));
};
