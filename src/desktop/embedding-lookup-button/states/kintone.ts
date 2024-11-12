import { getApp, getFormFields } from '@konomi-app/kintone-utilities';
import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { pluginConditionAtom } from './plugin';
import { isProd } from '@/lib/global';

export const srcAppAtom = atomFamily((conditionId: string) => {
  return atom(async (get) => {
    const condition = get(pluginConditionAtom(conditionId));

    const appProps = await getApp({
      id: condition.srcAppId,
      guestSpaceId: condition.isSrcAppGuestSpace ? (condition.srcSpaceId ?? undefined) : undefined,
      debug: !isProd,
    });

    return appProps;
  });
});

export const srcAppPropertiesAtom = atomFamily((conditionId: string) =>
  atom(async (get) => {
    const condition = get(pluginConditionAtom(conditionId));

    const { srcAppId, srcSpaceId, isSrcAppGuestSpace } = condition;

    const { properties } = await getFormFields({
      app: srcAppId,
      guestSpaceId: isSrcAppGuestSpace ? (srcSpaceId ?? undefined) : undefined,
      debug: !isProd,
    });

    return properties;
  })
);
