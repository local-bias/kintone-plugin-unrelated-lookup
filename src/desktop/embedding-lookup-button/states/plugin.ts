import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { pluginConfigAtom } from '@/desktop/states';

export const pluginConditionAtom = atomFamily((conditionId: string) =>
  atom<Plugin.Condition>((get) => {
    const config = get(pluginConfigAtom);
    return config.conditions.find((c) => c.id === conditionId)!;
  })
);

export const searchInputAtom = atomFamily((conditionId: string) => atom(''));
export const alreadyCacheAtom = atomFamily((conditionId: string) => atom(false));
export const alreadyLookupAtom = atomFamily((conditionId: string) => atom(false));
