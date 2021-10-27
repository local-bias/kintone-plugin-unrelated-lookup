import { atom } from 'recoil';

const state = atom<kintone.plugin.Condition | null>({
  key: 'pluginConditionState',
  default: null,
});

export default state;
