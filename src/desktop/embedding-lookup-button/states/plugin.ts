import { atom } from 'recoil';

const PREFIX = 'plugin';

export const pluginConditionState = atom<Plugin.Condition | null>({
  key: `${PREFIX}pluginConditionState`,
  default: null,
});

export const searchInputState = atom<string>({ key: `${PREFIX}searchInputState`, default: '' });

export const alreadyCacheState = atom({ key: `${PREFIX}alreadyCacheState`, default: false });

export const alreadyLookupState = atom({ key: `${PREFIX}alreadyLookupState`, default: false });
