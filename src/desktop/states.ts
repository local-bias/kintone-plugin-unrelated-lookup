import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { store } from './store';

type Field = {
  fieldCode: string;
  valueAtStart: string;
  lookuped: boolean;
};

export const cacheAtom = atomFamily((conditionId: string) =>
  atom<Field>({
    fieldCode: '',
    valueAtStart: '',
    lookuped: false,
  })
);

export const getCachedValue = (conditionId: string) => {
  const atom = cacheAtom(conditionId);
  return store.get(atom);
};

export const setCachedValue = (conditionId: string, value: Field) => {
  const atom = cacheAtom(conditionId);
  store.set(atom, value);
};
