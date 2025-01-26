import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { srcAppAtom } from './kintone';
import { areAttachmentsEqual, AttachmentAtomParams } from '.';

export const dialogPageChunkAtom = atomFamily((_conditionId: string) => atom(80));
export const dialogPageIndexAtom = atomFamily(
  (_params: AttachmentAtomParams) => atom(1),
  areAttachmentsEqual
);
export const isDialogShownAtom = atomFamily(
  (_params: AttachmentAtomParams) => atom(false),
  areAttachmentsEqual
);

export const dialogTitleAtom = atomFamily((conditionId: string) => {
  return atom(async (get) => {
    const app = await get(srcAppAtom(conditionId));
    return app.name;
  });
});

export const dialogLoadingAtom = atomFamily(
  (_params: AttachmentAtomParams) => atom(false),
  areAttachmentsEqual
);
