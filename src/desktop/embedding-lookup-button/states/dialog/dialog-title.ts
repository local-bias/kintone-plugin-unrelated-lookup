import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import { selector } from 'recoil';
import { pluginConditionState } from '..';

const state = selector<string>({
  key: 'dialogTitleState',
  get: async ({ get }) => {
    const condition = get(pluginConditionState);

    if (!condition) {
      return 'アプリから情報を取得';
    }

    const client = new KintoneRestAPIClient();
    const appProps = await client.app.getApp({ id: condition.srcAppId });

    return appProps.name;
  },
});

export default state;
