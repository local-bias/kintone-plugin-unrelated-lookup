declare namespace Plugin {
  /** 🔌 プラグインがアプリ単位で保存する設定情報 */
  type Config = ConfigV5;

  /** 🔌 プラグインの共通設定 */
  type Common = Config['common'];

  /** 🔌 プラグインの詳細設定 */
  type Condition = Config['conditions'][number];

  /** 🔌 過去全てのバージョンを含むプラグインの設定情報 */
  type AnyConfig = ConfigV1 | ConfigV2 | ConfigV3 | ConfigV4 | ConfigV5;

  type ConfigV5 = {
    version: 5;
    common: {};
    conditions: (Omit<ConfigV4['conditions'][number], 'sees'> & {
      /** フィールドの設置タイプ */
      type: 'single' | 'subtable';
      /** ルックアップ実行時、ダイアログ内のレコード一覧に表示するフィールド */
      displayFields: {
        id: string;
        fieldCode: string;
        isLookupField: boolean;
      }[];
      sortCriteria: {
        fieldCode: string;
        order: 'asc' | 'desc';
      }[];
    })[];
  };

  type ConfigV4 = {
    version: 4;
    common: {};
    conditions: (ConfigV3['conditions'][number] & {
      id: string;
    })[];
  };

  type ConfigV3 = {
    version: 3;
    conditions: (ConfigV2['conditions'][number] & {
      srcSpaceId: string | null;
      isSrcAppGuestSpace: boolean;
    })[];
  };

  type ConfigV2 = {
    version: 2;
    conditions: {
      srcAppId: string;
      srcField: string;
      dstField: string;
      copies: { from: string; to: string }[];
      sees: string[];
      enablesCache: boolean;
      enablesValidation: boolean;
      autoLookup: boolean;
      saveAndLookup: boolean;
      query: string;
      isCaseSensitive: boolean;
      isKatakanaSensitive: boolean;
      isZenkakuEisujiSensitive: boolean;
      isHankakuKatakanaSensitive: boolean;
    }[];
  };

  type ConfigV1 = {
    version: 1;
    common: {};
    conditions: {
      srcAppId: string;
      srcField: string;
      dstField: string;
      copies: { from: string; to: string }[];
      sees: string[];
      enablesCache: boolean;
      enablesValidation: boolean;
      autoLookup: boolean;
      saveAndLookup: boolean;
      query: string;
      ignoresLetterCase?: boolean;
      ignoresKatakana?: boolean;
      ignoresZenkakuEisuji?: boolean;
      ignoresHankakuKatakana?: boolean;
    }[];
  };
}
