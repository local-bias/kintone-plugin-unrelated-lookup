import { getUpdatedStorage, restorePluginConfig } from '@/lib/plugin';
import { RecoilState, atom, selector, selectorFamily } from 'recoil';

const PREFIX = 'plugin';

export const storageState = atom<Plugin.Config>({
  key: `${PREFIX}storageState`,
  default: restorePluginConfig(),
});

export const loadingState = atom<boolean>({
  key: `${PREFIX}loadingState`,
  default: false,
});

export const tabIndexState = atom<number>({
  key: `${PREFIX}tabIndexState`,
  default: 0,
});

export const conditionsState = selector<Plugin.Condition[]>({
  key: `${PREFIX}conditionsState`,
  get: ({ get }) => {
    const storage = get(storageState);
    return storage.conditions ?? [];
  },
});

const conditionPropertyState = selectorFamily<
  Plugin.Condition[keyof Plugin.Condition],
  keyof Plugin.Condition
>({
  key: `${PREFIX}conditionPropertyState`,
  get:
    (key) =>
    ({ get }) => {
      const conditionIndex = get(tabIndexState);
      const storage = get(storageState);
      return storage.conditions[conditionIndex][key];
    },
  set:
    (key) =>
    ({ get, set }, newValue) => {
      const conditionIndex = get(tabIndexState);
      set(storageState, (current) =>
        getUpdatedStorage(current, {
          conditionIndex,
          key,
          value: newValue as Plugin.Condition[keyof Plugin.Condition],
        })
      );
    },
});

export const dstFieldState = conditionPropertyState('dstField') as RecoilState<
  Plugin.Condition['dstField']
>;
export const srcAppIdState = conditionPropertyState('srcAppId') as RecoilState<
  Plugin.Condition['srcAppId']
>;
export const srcFieldState = conditionPropertyState('srcField') as RecoilState<
  Plugin.Condition['srcField']
>;
export const copiesState = conditionPropertyState('copies') as RecoilState<
  Plugin.Condition['copies']
>;
export const seesState = conditionPropertyState('sees') as RecoilState<Plugin.Condition['sees']>;
export const queryState = conditionPropertyState('query') as RecoilState<Plugin.Condition['query']>;
export const enablesCacheState = conditionPropertyState('enablesCache') as RecoilState<
  Plugin.Condition['enablesCache']
>;
export const autoLookupState = conditionPropertyState('autoLookup') as RecoilState<
  Plugin.Condition['autoLookup']
>;
export const enablesValidationState = conditionPropertyState('enablesValidation') as RecoilState<
  Plugin.Condition['enablesValidation']
>;
export const saveAndLookupState = conditionPropertyState('saveAndLookup') as RecoilState<
  Plugin.Condition['saveAndLookup']
>;
export const isCaseSensitiveState = conditionPropertyState('isCaseSensitive') as RecoilState<
  Plugin.Condition['isCaseSensitive']
>;
export const isKatakanaSensitiveState = conditionPropertyState(
  'isKatakanaSensitive'
) as RecoilState<Plugin.Condition['isKatakanaSensitive']>;
export const isHankakuKatakanaSensitiveState = conditionPropertyState(
  'isHankakuKatakanaSensitive'
) as RecoilState<Plugin.Condition['isHankakuKatakanaSensitive']>;
export const isZenkakuEisujiSensitiveState = conditionPropertyState(
  'isZenkakuEisujiSensitive'
) as RecoilState<Plugin.Condition['isZenkakuEisujiSensitive']>;
