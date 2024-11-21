import { restoreStorage } from '@konomi-app/kintone-utilities';
import { produce } from 'immer';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { PLUGIN_ID } from './global';

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

const PluginConditionV2Schema = PluginConditionV1Schema.omit({
  ignoresLetterCase: true,
  ignoresKatakana: true,
  ignoresZenkakuEisuji: true,
  ignoresHankakuKatakana: true,
}).merge(
  z.object({
    isCaseSensitive: z.boolean(),
    isKatakanaSensitive: z.boolean(),
    isZenkakuEisujiSensitive: z.boolean(),
    isHankakuKatakanaSensitive: z.boolean(),
  })
);
const PluginConfigV2Schema = z.object({
  version: z.literal(2),
  conditions: z.array(PluginConditionV2Schema),
});
type PluginConfigV2 = z.infer<typeof PluginConfigV2Schema>;

const PluginConditionV3Schema = PluginConditionV2Schema.merge(
  z.object({
    srcSpaceId: z.string().nullable(),
    isSrcAppGuestSpace: z.boolean(),
  })
);
const PluginConfigV3Schema = z.object({
  version: z.literal(3),
  conditions: z.array(PluginConditionV3Schema),
});
type PluginConfigV3 = z.infer<typeof PluginConfigV3Schema>;

const PluginConditionV4Schema = PluginConditionV3Schema.merge(
  z.object({
    id: z.string(),
  })
);
const PluginConfigV4Schema = z.object({
  version: z.literal(4),
  common: z.object({}),
  conditions: z.array(PluginConditionV4Schema),
});
type PluginConfigV4 = z.infer<typeof PluginConfigV4Schema>;

const PluginConditionV5Schema = PluginConditionV4Schema.omit({
  sees: true,
}).merge(
  z.object({
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
  })
);
const PluginConfigV5Schema = z.object({
  version: z.literal(5),
  common: z.object({}),
  conditions: z.array(PluginConditionV5Schema),
});
type PluginConfigV5 = z.infer<typeof PluginConfigV5Schema>;

const PluginConditionV6Schema = PluginConditionV5Schema.merge(
  z.object({
    dstSubtableFieldCode: z.string(),
    dstInsubtableFieldCode: z.string(),
    insubtableCopies: z.array(z.object({ from: z.string(), to: z.string() })),
  })
);
const PluginConfigV6Schema = z.object({
  version: z.literal(6),
  common: z.object({}),
  conditions: z.array(PluginConditionV6Schema),
});
type PluginConfigV6 = z.infer<typeof PluginConfigV6Schema>;

// const PluginConditionV7Schema = PluginConditionV6Schema.merge(
//   z.object({
//     dynamicCondition: z.array(
//       z.object({
//         type: z.union([z.literal('include'), z.literal('exclude')]),
//         targetFieldCode: z.string(),
//         sourceFieldCode: z.string(),
//       })
//     ),
//   })
// );

export type PluginConfig = PluginConfigV6;
export type PluginCommonConfig = PluginConfig['common'];
export type PluginCondition = PluginConfig['conditions'][number];

export type AnyConfig =
  | PluginConfigV1
  | PluginConfigV2
  | PluginConfigV3
  | PluginConfigV4
  | PluginConfigV5
  | PluginConfigV6;

export const validateCondition = (condition: unknown): PluginCondition => {
  return PluginConditionV6Schema.parse(condition);
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
  query: '',
  isCaseSensitive: false,
  isKatakanaSensitive: false,
  isZenkakuEisujiSensitive: false,
  isHankakuKatakanaSensitive: false,
  dstSubtableFieldCode: '',
  dstInsubtableFieldCode: '',
  insubtableCopies: [{ from: '', to: '' }],
});

/**
 * プラグインの設定情報のひな形を返却します
 */
export const createConfig = (): PluginConfig => ({
  version: 6,
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
  const config = restoreStorage<PluginConfig>(PLUGIN_ID) ?? createConfig();
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
