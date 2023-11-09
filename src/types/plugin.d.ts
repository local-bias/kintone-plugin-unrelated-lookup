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
      related: string;
      target: string;
      copies: { from: string; to: string }[];
      sees: string[];
      enablesCache: boolean;
      enablesValidation: boolean;
      autoLookup: boolean;
    }[];
  };
}
