import { z } from 'zod';

const PluginConditionV1Schema = z.object({
  srcAppId: z.string(),
  srcField: z.string(),
  dstField: z.string(),
  copies: z.array(z.object({ from: z.string(), to: z.string() })),
  sees: z.array(z.string()),
  enablesCache: z.boolean(),
  enablesValidation: z.boolean(),
  autoLookup: z.boolean(),
  saveAndLookup: z.boolean(),
  query: z.string(),
  ignoresLetterCase: z.boolean().optional(),
  ignoresKatakana: z.boolean().optional(),
  ignoresZenkakuEisuji: z.boolean().optional(),
  ignoresHankakuKatakana: z.boolean().optional(),
});

const PluginConfigV1Schema = z.object({
  version: z.literal(1),
  common: z.object({}),
  conditions: z.array(PluginConditionV1Schema),
});
type PluginConfigV1 = z.infer<typeof PluginConfigV1Schema>;

const PluginConditionV2Schema = z.object({
  srcAppId: z.string(),
  srcField: z.string(),
  dstField: z.string(),
  copies: z.array(z.object({ from: z.string(), to: z.string() })),
  sees: z.array(z.string()),
  enablesCache: z.boolean(),
  enablesValidation: z.boolean(),
  autoLookup: z.boolean(),
  saveAndLookup: z.boolean(),
  query: z.string(),
  isCaseSensitive: z.boolean(),
  isKatakanaSensitive: z.boolean(),
  isZenkakuEisujiSensitive: z.boolean(),
  isHankakuKatakanaSensitive: z.boolean(),
});
const PluginConfigV2Schema = z.object({
  version: z.literal(2),
  conditions: z.array(PluginConditionV2Schema),
});
type PluginConfigV2 = z.infer<typeof PluginConfigV2Schema>;

const PluginConditionV3Schema = z.object({
  srcAppId: z.string(),
  srcField: z.string(),
  dstField: z.string(),
  copies: z.array(z.object({ from: z.string(), to: z.string() })),
  sees: z.array(z.string()),
  enablesCache: z.boolean(),
  enablesValidation: z.boolean(),
  autoLookup: z.boolean(),
  saveAndLookup: z.boolean(),
  query: z.string(),
  isCaseSensitive: z.boolean(),
  isKatakanaSensitive: z.boolean(),
  isZenkakuEisujiSensitive: z.boolean(),
  isHankakuKatakanaSensitive: z.boolean(),
  srcSpaceId: z.string().nullable(),
  isSrcAppGuestSpace: z.boolean(),
});
const PluginConfigV3Schema = z.object({
  version: z.literal(3),
  conditions: z.array(PluginConditionV3Schema),
});
type PluginConfigV3 = z.infer<typeof PluginConfigV3Schema>;

const PluginConditionV4Schema = z.object({
  id: z.string(),
  srcAppId: z.string(),
  srcField: z.string(),
  dstField: z.string(),
  copies: z.array(z.object({ from: z.string(), to: z.string() })),
  sees: z.array(z.string()),
  enablesCache: z.boolean(),
  enablesValidation: z.boolean(),
  autoLookup: z.boolean(),
  saveAndLookup: z.boolean(),
  query: z.string(),
  isCaseSensitive: z.boolean(),
  isKatakanaSensitive: z.boolean(),
  isZenkakuEisujiSensitive: z.boolean(),
  isHankakuKatakanaSensitive: z.boolean(),
  srcSpaceId: z.string().nullable(),
  isSrcAppGuestSpace: z.boolean(),
});
const PluginConfigV4Schema = z.object({
  version: z.literal(4),
  common: z.object({}),
  conditions: z.array(PluginConditionV4Schema),
});
type PluginConfigV4 = z.infer<typeof PluginConfigV4Schema>;

const PluginConditionV5Schema = z.object({
  id: z.string(),
  srcAppId: z.string(),
  srcField: z.string(),
  dstField: z.string(),
  copies: z.array(z.object({ from: z.string(), to: z.string() })),
  enablesCache: z.boolean(),
  enablesValidation: z.boolean(),
  autoLookup: z.boolean(),
  saveAndLookup: z.boolean(),
  query: z.string(),
  isCaseSensitive: z.boolean(),
  isKatakanaSensitive: z.boolean(),
  isZenkakuEisujiSensitive: z.boolean(),
  isHankakuKatakanaSensitive: z.boolean(),
  srcSpaceId: z.string().nullable(),
  isSrcAppGuestSpace: z.boolean(),
  type: z.union([z.literal('single'), z.literal('subtable')]),
  displayFields: z.array(
    z.object({
      id: z.string(),
      fieldCode: z.string(),
      isLookupField: z.boolean(),
    })
  ),
  sortCriteria: z.array(
    z.object({
      fieldCode: z.string(),
      order: z.union([z.literal('asc'), z.literal('desc')]),
    })
  ),
});
const PluginConfigV5Schema = z.object({
  version: z.literal(5),
  common: z.object({}),
  conditions: z.array(PluginConditionV5Schema),
});
type PluginConfigV5 = z.infer<typeof PluginConfigV5Schema>;

const PluginConditionV6Schema = z.object({
  id: z.string(),
  srcAppId: z.string(),
  srcField: z.string(),
  dstField: z.string(),
  copies: z.array(z.object({ from: z.string(), to: z.string() })),
  enablesCache: z.boolean(),
  enablesValidation: z.boolean(),
  autoLookup: z.boolean(),
  saveAndLookup: z.boolean(),
  query: z.string(),
  isCaseSensitive: z.boolean(),
  isKatakanaSensitive: z.boolean(),
  isZenkakuEisujiSensitive: z.boolean(),
  isHankakuKatakanaSensitive: z.boolean(),
  srcSpaceId: z.string().nullable(),
  isSrcAppGuestSpace: z.boolean(),
  type: z.union([z.literal('single'), z.literal('subtable')]),
  displayFields: z.array(
    z.object({
      id: z.string(),
      fieldCode: z.string(),
      isLookupField: z.boolean(),
    })
  ),
  sortCriteria: z.array(
    z.object({
      fieldCode: z.string(),
      order: z.union([z.literal('asc'), z.literal('desc')]),
    })
  ),
  dstSubtableFieldCode: z.string(),
  dstInsubtableFieldCode: z.string(),
  insubtableCopies: z.array(z.object({ from: z.string(), to: z.string() })),
});
const PluginConfigV6Schema = z.object({
  version: z.literal(6),
  common: z.object({}),
  conditions: z.array(PluginConditionV6Schema),
});
type PluginConfigV6 = z.infer<typeof PluginConfigV6Schema>;

const PluginConditionV7Schema = z.object({
  id: z.string(),
  srcAppId: z.string(),
  srcField: z.string(),
  dstField: z.string(),
  copies: z.array(z.object({ from: z.string(), to: z.string() })),
  enablesCache: z.boolean(),
  enablesValidation: z.boolean(),
  autoLookup: z.boolean(),
  saveAndLookup: z.boolean(),
  query: z.string(),
  isCaseSensitive: z.boolean(),
  isKatakanaSensitive: z.boolean(),
  isZenkakuEisujiSensitive: z.boolean(),
  isHankakuKatakanaSensitive: z.boolean(),
  srcSpaceId: z.string().nullable(),
  isSrcAppGuestSpace: z.boolean(),
  type: z.union([z.literal('single'), z.literal('subtable')]),
  displayFields: z.array(
    z.object({
      id: z.string(),
      fieldCode: z.string(),
      isLookupField: z.boolean(),
    })
  ),
  sortCriteria: z.array(
    z.object({
      fieldCode: z.string(),
      order: z.union([z.literal('asc'), z.literal('desc')]),
    })
  ),
  dstSubtableFieldCode: z.string(),
  dstInsubtableFieldCode: z.string(),
  insubtableCopies: z.array(z.object({ from: z.string(), to: z.string() })),
  isAutoCompletionEnabled: z.boolean(),
  dynamicCondition: z.array(
    z.object({
      type: z.union([z.literal('include'), z.literal('exclude')]),
      isFuzzySearchEnabled: z.boolean(),
      targetFieldCode: z.string(),
      sourceFieldCode: z.string(),
    })
  ),
});
const PluginConfigV7Schema = z.object({
  version: z.literal(7),
  common: z.object({}),
  conditions: z.array(PluginConditionV7Schema),
});
type PluginConfigV7 = z.infer<typeof PluginConfigV7Schema>;

const PluginConditionV8Schema = z.object({
  id: z.string(),
  srcAppId: z.string(),
  srcField: z.string(),
  dstField: z.string(),
  copies: z.array(z.object({ from: z.string(), to: z.string() })),
  enablesCache: z.boolean(),
  enablesValidation: z.boolean(),
  autoLookup: z.boolean(),
  saveAndLookup: z.boolean(),
  query: z.string(),
  isCaseSensitive: z.boolean(),
  isKatakanaSensitive: z.boolean(),
  isZenkakuEisujiSensitive: z.boolean(),
  isHankakuKatakanaSensitive: z.boolean(),
  srcSpaceId: z.string().nullable(),
  isSrcAppGuestSpace: z.boolean(),
  type: z.union([z.literal('single'), z.literal('subtable')]),
  displayFields: z.array(
    z.object({
      id: z.string(),
      fieldCode: z.string(),
      isLookupField: z.boolean(),
    })
  ),
  sortCriteria: z.array(
    z.object({
      fieldCode: z.string(),
      order: z.union([z.literal('asc'), z.literal('desc')]),
    })
  ),
  dstSubtableFieldCode: z.string(),
  dstInsubtableFieldCode: z.string(),
  insubtableCopies: z.array(z.object({ from: z.string(), to: z.string() })),
  isAutoCompletionEnabled: z.boolean(),
  dynamicConditions: z.array(
    z.object({
      type: z.union([z.literal('include'), z.literal('exclude')]),
      isFuzzySearchEnabled: z.boolean(),
      srcAppFieldCode: z.string(),
      dstAppFieldCode: z.string(),
    })
  ),
});
const PluginConfigV8Schema = z.object({
  version: z.literal(8),
  common: z.object({}),
  conditions: z.array(PluginConditionV8Schema),
});
type PluginConfigV8 = z.infer<typeof PluginConfigV8Schema>;

const PluginConditionV9Schema = z.object({
  id: z.string(),
  srcAppId: z.string(),
  srcField: z.string(),
  dstField: z.string(),
  copies: z.array(z.object({ from: z.string(), to: z.string() })),
  enablesCache: z.boolean(),
  enablesValidation: z.boolean(),
  autoLookup: z.boolean(),
  saveAndLookup: z.boolean(),
  isCaseSensitive: z.boolean(),
  isKatakanaSensitive: z.boolean(),
  isZenkakuEisujiSensitive: z.boolean(),
  isHankakuKatakanaSensitive: z.boolean(),
  srcSpaceId: z.string().nullable(),
  isSrcAppGuestSpace: z.boolean(),
  type: z.union([z.literal('single'), z.literal('subtable')]),
  displayFields: z.array(
    z.object({
      id: z.string(),
      fieldCode: z.string(),
      isLookupField: z.boolean(),
    })
  ),
  sortCriteria: z.array(
    z.object({
      fieldCode: z.string(),
      order: z.union([z.literal('asc'), z.literal('desc')]),
    })
  ),
  /**
   * 絞り込み条件として、完全にフリーワードで指定するか、簡易的なモードを使用するかを指定します。
   */
  filterMode: z.union([z.literal('freeWord'), z.literal('simple')]),
  filterQuery: z.string(),
  filterConditions: z.array(
    z.object({
      fieldCode: z.string(),
      operator: z.union([
        z.literal('equal'),
        z.literal('notEqual'),
        z.literal('greaterThan'),
        z.literal('greaterThanOrEqual'),
        z.literal('lessThan'),
        z.literal('lessThanOrEqual'),
        z.literal('include'),
        z.literal('notInclude'),
      ]),
      value: z.union([
        z.object({ type: z.literal('single'), value: z.string() }),
        z.object({ type: z.literal('multi'), value: z.array(z.string()) }),
      ]),
    })
  ),
  /** 絞り込み条件として、and検索かor検索どちらを利用するかを制御する */
  filterConditionType: z.union([z.literal('and'), z.literal('or')]),
  dstSubtableFieldCode: z.string(),
  dstInsubtableFieldCode: z.string(),
  insubtableCopies: z.array(z.object({ from: z.string(), to: z.string() })),
  isAutoCompletionEnabled: z.boolean(),
  dynamicConditions: z.array(
    z.object({
      type: z.union([z.literal('include'), z.literal('exclude')]),
      isFuzzySearchEnabled: z.boolean(),
      srcAppFieldCode: z.string(),
      dstAppFieldCode: z.string(),
    })
  ),
  /** `true`の場合、フェールソフト機能を有効にする */
  isFailSoftEnabled: z.boolean(),
});
const PluginConfigV9Schema = z.object({
  version: z.literal(9),
  common: z.object({}),
  conditions: z.array(PluginConditionV9Schema),
});
type PluginConfigV9 = z.infer<typeof PluginConfigV9Schema>;

export type PluginConfig = PluginConfigV9;
export type PluginCommonConfig = PluginConfig['common'];
export type PluginCondition = PluginConfig['conditions'][number];

export const LatestPluginConditionSchema = PluginConditionV9Schema;

export type AnyConfig =
  | PluginConfigV1
  | PluginConfigV2
  | PluginConfigV3
  | PluginConfigV4
  | PluginConfigV5
  | PluginConfigV6
  | PluginConfigV7
  | PluginConfigV8
  | PluginConfigV9;
