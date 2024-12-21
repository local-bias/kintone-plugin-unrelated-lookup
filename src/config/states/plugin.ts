import { restorePluginConfig } from '@/lib/plugin';
import { PluginCondition, PluginConfig } from '@/schema/plugin-config';
import { produce } from 'immer';
import { DefaultValue, RecoilState, atom, selector, selectorFamily } from 'recoil';

const PREFIX = 'plugin';

export const storageState = atom<PluginConfig>({
  key: `${PREFIX}storageState`,
  default: restorePluginConfig(),
});

export const loadingState = atom<boolean>({
  key: `${PREFIX}loadingState`,
  default: false,
});

export const conditionsState = selector<PluginCondition[]>({
  key: `${PREFIX}conditionsState`,
  get: ({ get }) => {
    const storage = get(storageState);
    return storage.conditions;
  },
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    set(storageState, (current) =>
      produce(current, (draft) => {
        draft.conditions = newValue;
      })
    );
  },
});

export const selectedConditionIdState = atom<string | null>({
  key: `${PREFIX}selectedConditionIdState`,
  default: selector<string | null>({
    key: `${PREFIX}selectedConditionIdStateDefault`,
    get: ({ get }) => {
      return get(conditionsState)[0]?.id ?? null;
    },
  }),
});

export const selectedConditionState = selector<PluginCondition>({
  key: `${PREFIX}selectedConditionState`,
  get: ({ get }) => {
    const conditions = get(conditionsState);
    const selectedId = get(selectedConditionIdState);
    return conditions.find((condition) => condition.id === selectedId) ?? conditions[0]!;
  },
  set: ({ get, set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    const conditions = get(conditionsState);
    const index = conditions.findIndex((condition) => condition.id === newValue.id);
    set(conditionsState, conditions.toSpliced(index, 1, newValue));
  },
});

const conditionPropertyState = selectorFamily<
  PluginCondition[keyof PluginCondition],
  keyof PluginCondition
>({
  key: `${PREFIX}conditionPropertyState`,
  get:
    (key) =>
    ({ get }) => {
      const selectedCondition = get(selectedConditionState);
      return selectedCondition[key];
    },
  set:
    (key) =>
    ({ get, set }, newValue) => {
      if (newValue instanceof DefaultValue) {
        process.env.NODE_ENV === 'development' && console.warn('newValue is DefaultValue');
        return;
      }
      set(selectedConditionState, (current) =>
        produce(current, (draft) => {
          // @ts-ignore
          draft[key] = newValue;
        })
      );
    },
});

export const getConditionPropertyState = <T extends keyof PluginCondition>(property: T) =>
  conditionPropertyState(property) as unknown as RecoilState<PluginCondition[T]>;

export const dstFieldState = conditionPropertyState('dstField') as RecoilState<
  PluginCondition['dstField']
>;
export const srcAppIdState = conditionPropertyState('srcAppId') as RecoilState<
  PluginCondition['srcAppId']
>;
export const srcSpaceIdState = conditionPropertyState('srcSpaceId') as RecoilState<
  PluginCondition['srcSpaceId']
>;
export const isSrcAppGuestSpaceState = conditionPropertyState('isSrcAppGuestSpace') as RecoilState<
  PluginCondition['isSrcAppGuestSpace']
>;
export const srcFieldState = conditionPropertyState('srcField') as RecoilState<
  PluginCondition['srcField']
>;
export const copiesState = conditionPropertyState('copies') as RecoilState<
  PluginCondition['copies']
>;
export const displayFieldsState = conditionPropertyState('displayFields') as RecoilState<
  PluginCondition['displayFields']
>;
export const queryState = conditionPropertyState('filterQuery') as RecoilState<
  PluginCondition['filterQuery']
>;
export const enablesCacheState = conditionPropertyState('enablesCache') as RecoilState<
  PluginCondition['enablesCache']
>;
export const autoLookupState = conditionPropertyState('autoLookup') as RecoilState<
  PluginCondition['autoLookup']
>;
export const enablesValidationState = conditionPropertyState('enablesValidation') as RecoilState<
  PluginCondition['enablesValidation']
>;
export const saveAndLookupState = conditionPropertyState('saveAndLookup') as RecoilState<
  PluginCondition['saveAndLookup']
>;
export const isCaseSensitiveState = conditionPropertyState('isCaseSensitive') as RecoilState<
  PluginCondition['isCaseSensitive']
>;
export const isKatakanaSensitiveState = conditionPropertyState(
  'isKatakanaSensitive'
) as RecoilState<PluginCondition['isKatakanaSensitive']>;
export const isHankakuKatakanaSensitiveState = conditionPropertyState(
  'isHankakuKatakanaSensitive'
) as RecoilState<PluginCondition['isHankakuKatakanaSensitive']>;
export const isZenkakuEisujiSensitiveState = conditionPropertyState(
  'isZenkakuEisujiSensitive'
) as RecoilState<PluginCondition['isZenkakuEisujiSensitive']>;
export const conditionTypeState = getConditionPropertyState('type');
export const dstSubtableFieldCodeState = getConditionPropertyState('dstSubtableFieldCode');
export const dstInsubtableFieldCodeState = getConditionPropertyState('dstInsubtableFieldCode');
export const insubtableCopiesState = getConditionPropertyState('insubtableCopies');
export const isFailSoftEnabledState = getConditionPropertyState('isFailSoftEnabled');
export const sortCriteriaState = getConditionPropertyState('sortCriteria');
