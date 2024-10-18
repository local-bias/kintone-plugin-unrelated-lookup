import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { pluginConditionAtom } from './plugin';
import { getApp } from '@konomi-app/kintone-utilities';
import { ENV } from '@/lib/global';

export const dialogPageIndexAtom = atomFamily((conditionId: string) => atom(1));
export const dialogPageChunkAtom = atomFamily((conditionId: string) => atom(80));
export const isDialogShownAtom = atomFamily((conditionId: string) => atom(false));

export const dialogTitleAtom = atomFamily((conditionId: string) => {
  return atom(async (get) => {
    const condition = get(pluginConditionAtom(conditionId));

    const appProps = await getApp({
      id: condition.srcAppId,
      guestSpaceId: condition.isSrcAppGuestSpace ? (condition.srcSpaceId ?? undefined) : undefined,
      debug: ENV === 'development',
    });

    return appProps.name;
  });
});
