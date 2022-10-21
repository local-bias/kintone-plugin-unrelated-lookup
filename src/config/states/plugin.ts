import produce from 'immer';
import { atom, selectorFamily } from 'recoil';

const PREFIX = 'plugin';

const updated = <T extends keyof kintone.plugin.Condition>(
  storage: kintone.plugin.Storage | null,
  props: {
    conditionIndex: number;
    key: T;
    value: kintone.plugin.Condition[T];
  }
) => {
  const { conditionIndex, key, value } = props;
  return produce(storage, (draft) => {
    if (!draft) {
      return;
    }
    draft.conditions[conditionIndex][key] = value;
  });
};

const getConditionField = <T extends keyof kintone.plugin.Condition>(
  storage: kintone.plugin.Storage | null,
  props: {
    conditionIndex: number;
    key: T;
    defaultValue: NonNullable<kintone.plugin.Condition[T]>;
  }
): NonNullable<kintone.plugin.Condition[T]> => {
  const { conditionIndex, key, defaultValue } = props;
  if (!storage || !storage.conditions[conditionIndex]) {
    return defaultValue;
  }
  return storage.conditions[conditionIndex][key] ?? defaultValue;
};

export const storageState = atom<kintone.plugin.Storage | null>({
  key: `${PREFIX}storageState`,
  default: null,
});

export const loadingState = atom<boolean>({
  key: `${PREFIX}loadingState`,
  default: false,
});

export const pluginIdState = atom<string>({ key: `${PREFIX}pluginIdState`, default: '' });

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
