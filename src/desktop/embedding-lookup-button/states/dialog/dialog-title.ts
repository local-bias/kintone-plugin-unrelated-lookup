import { getApp } from '@konomi-app/kintone-utilities';
import { selector } from 'recoil';
import { guestSpaceIdState, pluginConditionState } from '..';

const state = selector<string>({
  key: 'dialogTitleState',
  get: async ({ get }) => {
    const condition = get(pluginConditionState);
    const guestSpaceId = get(guestSpaceIdState);

    if (!condition) {
      return 'アプリから情報を取得';
    }

    const appProps = await getApp({
      id: condition.srcAppId,
      guestSpaceId: guestSpaceId ?? undefined,
      debug: process?.env?.NODE_ENV === 'development',
    });

    return appProps.name;
  },
});

export default state;
