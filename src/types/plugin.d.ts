declare namespace Plugin {
  /** プラグインがアプリ単位で保存する設定情報🔌 */
  type Config = ConfigV2;

  /** プラグインがアプリ単位で保存する設定情報🔌 */
  type Condition = Config['conditions'][number];

  /** 過去全てのバージョンを含む、プラグインがアプリ単位で保存する設定情報🔌 */
  type AnyConfig = ConfigV1 | ConfigV2;

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
