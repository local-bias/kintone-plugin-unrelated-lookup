import { PLUGIN_ID } from '@/common/global';
import { restorePluginConfig } from '@/common/plugin';
import { produce } from 'immer';
import { atom, selector, selectorFamily } from 'recoil';

const PREFIX = 'plugin';

const updated = <T extends keyof Plugin.Condition>(
  storage: Plugin.Config,
  props: {
    conditionIndex: number;
    key: T;
    value: Plugin.Condition[T];
  }
) => {
  const { conditionIndex, key, value } = props;
  return produce(storage, (draft) => {
    draft.conditions[conditionIndex][key] = value;
  });
};

const getConditionField = <T extends keyof Plugin.Condition>(
  storage: Plugin.Config,
  props: {
    conditionIndex: number;
    key: T;
    defaultValue: NonNullable<Plugin.Condition[T]>;
  }
): NonNullable<Plugin.Condition[T]> => {
  const { conditionIndex, key, defaultValue } = props;
  if (!storage.conditions[conditionIndex]) {
    return defaultValue;
  }
  return storage.conditions[conditionIndex][key] ?? defaultValue;
};

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

export const conditionState = selectorFamily<Plugin.Condition | null, number>({
  key: `${PREFIX}conditionState`,
  get:
    (conditionIndex) =>
    ({ get }) => {
      const storage = get(storageState);
      return !storage ? null : storage.conditions[conditionIndex] ?? null;
    },
  set:
    (conditionIndex) =>
    ({ set }, newValue) => {
      set(storageState, (current) =>
        produce(current, (draft) => {
          if (!draft) {
            return;
          }
          draft.conditions[conditionIndex] = newValue as Plugin.Condition;
        })
      );
    },
});

export const dstFieldState = selectorFamily<string, number>({
  key: `${PREFIX}dstFieldState`,
  get:
    (conditionIndex) =>
    ({ get }) => {
      return getConditionField(get(storageState), {
        conditionIndex,
        key: 'dstField',
        defaultValue: '',
      });
    },
  set:
    (conditionIndex) =>
    ({ set }, newValue) => {
      set(storageState, (current) =>
        updated(current, {
          conditionIndex,
          key: 'dstField',
          value: newValue as string,
        })
      );
    },
});

export const srcAppIdState = selectorFamily<string, number>({
  key: `${PREFIX}srcAppIdState`,
  get:
    (conditionIndex) =>
    ({ get }) => {
      return getConditionField(get(storageState), {
        conditionIndex,
        key: 'srcAppId',
        defaultValue: '',
      });
    },
  set:
    (conditionIndex) =>
    ({ set }, newValue) => {
      set(storageState, (current) =>
        updated(current, {
          conditionIndex,
          key: 'srcAppId',
          value: newValue as string,
        })
      );
    },
});

export const srcFieldState = selectorFamily<string, number>({
  key: `${PREFIX}srcFieldState`,
  get:
    (conditionIndex) =>
    ({ get }) => {
      return getConditionField(get(storageState), {
        conditionIndex,
        key: 'srcField',
        defaultValue: '',
      });
    },
  set:
    (conditionIndex) =>
    ({ set }, newValue) => {
      set(storageState, (current) =>
        updated(current, {
          conditionIndex,
          key: 'srcField',
          value: newValue as string,
        })
      );
    },
});

export const copiesState = selectorFamily<{ from: string; to: string }[], number>({
  key: `${PREFIX}copiesState`,
  get:
    (conditionIndex) =>
    ({ get }) => {
      return getConditionField(get(storageState), {
        conditionIndex,
        key: 'copies',
        defaultValue: [{ from: '', to: '' }],
      });
    },
  set:
    (conditionIndex) =>
    ({ set }, newValue) => {
      set(storageState, (current) =>
        updated(current, {
          conditionIndex,
          key: 'copies',
          value: newValue as { from: string; to: string }[],
        })
      );
    },
});

export const seesState = selectorFamily<string[], number>({
  key: `${PREFIX}seesState`,
  get:
    (conditionIndex) =>
    ({ get }) => {
      return getConditionField(get(storageState), {
        conditionIndex,
        key: 'sees',
        defaultValue: [''],
      });
    },
  set:
    (conditionIndex) =>
    ({ set }, newValue) => {
      set(storageState, (current) =>
        updated(current, {
          conditionIndex,
          key: 'sees',
          value: newValue as string[],
        })
      );
    },
});

export const queryState = selectorFamily<string, number>({
  key: `${PREFIX}queryState`,
  get:
    (conditionIndex) =>
    ({ get }) => {
      return getConditionField(get(storageState), {
        conditionIndex,
        key: 'query',
        defaultValue: '',
      });
    },
  set:
    (conditionIndex) =>
    ({ set }, newValue) => {
      set(storageState, (current) =>
        updated(current, {
          conditionIndex,
          key: 'query',
          value: newValue as string,
        })
      );
    },
});

export const enablesCacheState = selectorFamily<boolean, number>({
  key: `${PREFIX}enablesCacheState`,
  get:
    (conditionIndex) =>
    ({ get }) => {
      return getConditionField(get(storageState), {
        conditionIndex,
        key: 'enablesCache',
        defaultValue: false,
      });
    },
  set:
    (conditionIndex) =>
    ({ set }, newValue) => {
      set(storageState, (current) =>
        updated(current, {
          conditionIndex,
          key: 'enablesCache',
          value: newValue as boolean,
        })
      );
    },
});

export const autoLookupState = selectorFamily<boolean, number>({
  key: `${PREFIX}autoLookupState`,
  get:
    (conditionIndex) =>
    ({ get }) => {
      return getConditionField(get(storageState), {
        conditionIndex,
        key: 'autoLookup',
        defaultValue: false,
      });
    },
  set:
    (conditionIndex) =>
    ({ set }, newValue) => {
      set(storageState, (current) =>
        updated(current, {
          conditionIndex,
          key: 'autoLookup',
          value: newValue as boolean,
        })
      );
    },
});

export const enablesValidationState = selectorFamily<boolean, number>({
  key: `${PREFIX}enablesValidationState`,
  get:
    (conditionIndex) =>
    ({ get }) => {
      return getConditionField(get(storageState), {
        conditionIndex,
        key: 'enablesValidation',
        defaultValue: false,
      });
    },
  set:
    (conditionIndex) =>
    ({ set }, newValue) => {
      set(storageState, (current) =>
        updated(current, {
          conditionIndex,
          key: 'enablesValidation',
          value: newValue as boolean,
        })
      );
    },
});

export const saveAndLookupState = selectorFamily<boolean, number>({
  key: `${PREFIX}saveAndLookupState`,
  get:
    (conditionIndex) =>
    ({ get }) => {
      return getConditionField(get(storageState), {
        conditionIndex,
        key: 'saveAndLookup',
        defaultValue: false,
      });
    },
  set:
    (conditionIndex) =>
    ({ set }, newValue) => {
      set(storageState, (current) =>
        updated(current, {
          conditionIndex,
          key: 'saveAndLookup',
          value: newValue as boolean,
        })
      );
    },
});

export const ignoresLetterCaseState = selectorFamily<boolean, number>({
  key: `${PREFIX}ignoresLetterCaseState`,
  get:
    (conditionIndex) =>
    ({ get }) => {
      return getConditionField(get(storageState), {
        conditionIndex,
        key: 'ignoresLetterCase',
        defaultValue: false,
      });
    },
  set:
    (conditionIndex) =>
    ({ set }, newValue) => {
      set(storageState, (current) =>
        updated(current, {
          conditionIndex,
          key: 'ignoresLetterCase',
          value: newValue as boolean,
        })
      );
    },
});

export const ignoresKatakanaState = selectorFamily<boolean, number>({
  key: `${PREFIX}ignoresKatakanaState`,
  get:
    (conditionIndex) =>
    ({ get }) => {
      return getConditionField(get(storageState), {
        conditionIndex,
        key: 'ignoresKatakana',
        defaultValue: false,
      });
    },
  set:
    (conditionIndex) =>
    ({ set }, newValue) => {
      set(storageState, (current) =>
        updated(current, {
          conditionIndex,
          key: 'ignoresKatakana',
          value: newValue as boolean,
        })
      );
    },
});

export const ignoresZenkakuEisujiState = selectorFamily<boolean, number>({
  key: `${PREFIX}ignoresZenkakuEisujiState`,
  get:
    (conditionIndex) =>
    ({ get }) => {
      return getConditionField(get(storageState), {
        conditionIndex,
        key: 'ignoresZenkakuEisuji',
        defaultValue: false,
      });
    },
  set:
    (conditionIndex) =>
    ({ set }, newValue) => {
      set(storageState, (current) =>
        updated(current, {
          conditionIndex,
          key: 'ignoresZenkakuEisuji',
          value: newValue as boolean,
        })
      );
    },
});

export const ignoresHankakuKatakanaState = selectorFamily<boolean, number>({
  key: `${PREFIX}ignoresHankakuKatakanaState`,
  get:
    (conditionIndex) =>
    ({ get }) => {
      return getConditionField(get(storageState), {
        conditionIndex,
        key: 'ignoresHankakuKatakana',
        defaultValue: false,
      });
    },
  set:
    (conditionIndex) =>
    ({ set }, newValue) => {
      set(storageState, (current) =>
        updated(current, {
          conditionIndex,
          key: 'ignoresHankakuKatakana',
          value: newValue as boolean,
        })
      );
    },
});
