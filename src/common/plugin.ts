import produce from 'immer';

/**
 * プラグインがアプリ単位で保存している設定情報を返却します
 */
export const restoreStorage = (id: string): kintone.plugin.Storage => {
  const config: Record<string, string> = kintone.plugin.app.getConfig(id);

  if (!Object.keys(config).length) {
    return createConfig();
  }
  return Object.entries(config).reduce<any>(
    (acc, [key, value]) => ({ ...acc, [key]: JSON.parse(value) }),
    {}
  );
};

/**
 * アプリにプラグインの設定情報を保存します
 */
export const storeStorage = (target: kintone.plugin.Storage, callback?: () => void): void => {
  const converted = Object.entries(target).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: JSON.stringify(value) }),
    {}
  );

  kintone.plugin.app.setConfig(converted, callback);
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
const createConfig = (): kintone.plugin.Storage => ({
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
});
