import { produce } from 'immer';
import { restoreStorage as restore } from '@konomi-app/kintone-utilities';

/**
 * プラグインがアプリ単位で保存している設定情報を返却します
 */
export const restoreStorage = (id: string): kintone.plugin.Storage => {
  return restore(id) ?? createConfig();
};

/**
 * プラグイン設定時に残った、不要な設定情報を整理します
 * @param target プラグインの設定情報
 * @returns 整理したプラグインの設定情報
 */
export const cleanseStorage = (target: kintone.plugin.Storage): kintone.plugin.Storage => {
  const cleansed = produce(target, (draft) => {
    for (const condition of draft.conditions) {
      condition.copies = condition.copies.filter(({ from, to }) => from && to);
      condition.sees = condition.sees.filter((field) => field);
    }
  });
  return cleansed;
};

/**
 * プラグインの設定情報のひな形を返却します
 */
export const createConfig = (): kintone.plugin.Storage => ({
  conditions: [getNewCondition()],
});

export const getNewCondition = (): kintone.plugin.Condition => ({
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
