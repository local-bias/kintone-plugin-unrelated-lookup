import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { srcAppAtom } from './kintone';

export const dialogPageIndexAtom = atomFamily((_conditionId: string) => atom(1));
export const dialogPageChunkAtom = atomFamily((_conditionId: string) => atom(80));
export const isDialogShownAtom = atomFamily((_conditionId: string) => atom(false));

export const dialogTitleAtom = atomFamily((conditionId: string) => {
  return atom(async (get) => {
    const app = await get(srcAppAtom(conditionId));
    return app.name;
  });
});
