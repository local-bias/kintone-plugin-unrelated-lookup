import { getKintoneApps } from '@common/kintone-api';
import { selector } from 'recoil';

export const kintoneAppsState = selector({
  key: 'kintoneAppsState',
  get: async () => {
    const apps = await getKintoneApps();
    return apps;
  },
});
