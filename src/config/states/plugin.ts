import { atom } from 'recoil';

export const storageState = atom<kintone.plugin.Storage | null>({
  key: 'PluginStorage',
  default: null,
});

export const pluginIdState = atom<string>({ key: 'PluginId', default: '' });
