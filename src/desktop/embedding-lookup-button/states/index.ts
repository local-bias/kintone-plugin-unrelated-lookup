import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { pluginConditionAtom } from './plugin';
export * from './plugin';

export const loadingCountAtom = atomFamily((conditionId: string) => atom(0));
export const loadingAtom = atomFamily((conditionId: string) =>
  atom((get) => get(loadingCountAtom(conditionId)) > 0)
);

const privateIsRecordCacheEnabledAtom = atomFamily((coditionId: string) => atom(false));
export const isRecordCacheEnabledAtom = atomFamily((conditionId: string) =>
  atom(
    (get) => {
      const privateValue = get(privateIsRecordCacheEnabledAtom(conditionId));
      if (privateValue) {
        return true;
      }
      const condition = get(pluginConditionAtom(conditionId));
      return condition.enablesCache;
    },
    (get, set, newValue) => {
      set(privateIsRecordCacheEnabledAtom(conditionId), newValue as boolean);
    }
  )
);
