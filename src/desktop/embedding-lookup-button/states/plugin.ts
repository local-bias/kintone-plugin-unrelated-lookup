import { pluginConfigAtom } from '@/desktop/states';
import { PluginCondition } from '@/lib/plugin';
import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { AttachmentProps } from '../app';

export type AttachmentAtomParams = AttachmentProps;

export const pluginConditionAtom = atomFamily((conditionId: string) =>
  atom<PluginCondition>((get) => {
    const config = get(pluginConfigAtom);
    return config.conditions.find((c) => c.id === conditionId)!;
  })
);

export function areAttachmentsEqual(a: AttachmentAtomParams, b: AttachmentAtomParams) {
  return a.conditionId === b.conditionId && a.rowIndex === b.rowIndex;
}

const privateIsRecordCacheEnabledAtom = atomFamily((_conditionId: string) => atom(false));
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

export const alreadyCacheAtom = atomFamily((_conditionId: string) => atom(false));
export const searchInputAtom = atomFamily(
  (_params: AttachmentAtomParams) => atom<string>(''),
  areAttachmentsEqual
);
