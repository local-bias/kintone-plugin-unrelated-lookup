import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

export const loadingCountAtom = atomFamily((_conditionId: string) => atom(0));
export const loadingAtom = atomFamily((conditionId: string) =>
  atom((get) => get(loadingCountAtom(conditionId)) > 0)
);
