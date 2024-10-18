import { cleanse, restorePluginConfig } from '@/lib/plugin';
import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

export const pluginConfigAtom = atom(cleanse(restorePluginConfig()));

export const pluginConditionAtom = atomFamily((conditionId: string) =>
  atom<Plugin.Condition>((get) => {
    const config = get(pluginConfigAtom);
    return config.conditions.find((c) => c.id === conditionId)!;
  })
);

export const searchInputAtom = atomFamily((conditionId: string) => atom(''));
export const alreadyCacheAtom = atomFamily((conditionId: string) => atom(false));
export const alreadyLookupAtom = atomFamily((conditionId: string) => atom(false));
