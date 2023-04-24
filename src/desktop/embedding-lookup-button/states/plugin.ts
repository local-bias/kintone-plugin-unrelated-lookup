import { atom } from 'recoil';

const PREFIX = 'plugin';

export const pluginConditionState = atom<kintone.plugin.Condition | null>({
  key: `${PREFIX}pluginConditionState`,
  default: null,
});

export const guestSpaceIdState = atom<string | null>({
  key: `${PREFIX}guestSpaceIdState`,
  default: null,
});
