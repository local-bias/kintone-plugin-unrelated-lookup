import { getApp } from '@konomi-app/kintone-utilities';
import { selector } from 'recoil';
import { pluginConditionState } from '..';

const state = selector<string>({
  key: 'dialogTitleState',
  get: async ({ get }) => {
    const condition = get(pluginConditionState);

    if (!condition) {
      return 'アプリから情報を取得';
    }

    const appProps = await getApp({
      id: condition.srcAppId,
      guestSpaceId: condition.isSrcAppGuestSpace ? condition.srcSpaceId ?? undefined : undefined,
      debug: process?.env?.NODE_ENV === 'development',
    });

    return appProps.name;
  },
});

export default state;
