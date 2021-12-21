import { getAllApps } from '@common/kintone-rest-api';
import { selector } from 'recoil';

export const kintoneAppsState = selector({
  key: 'kintoneAppsState',
  get: async () => {
    const apps = await getAllApps();
    return apps;
  },
});
