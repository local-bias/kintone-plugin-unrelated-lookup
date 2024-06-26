import { restorePluginConfig } from '@/lib/plugin';
import { atom, atomFamily, selector } from 'recoil';

const PREFIX = 'plugin';

export const pluginConfigState = atom<Plugin.Config>({
  key: `${PREFIX}/pluginConfigState`,
  default: restorePluginConfig({ cleansed: true }),
});

export const pluginConditionsState = selector<Plugin.Condition[]>({
  key: `${PREFIX}/pluginConditionsState`,
  get: ({ get }) => {
    const config = get(pluginConfigState);
    return config.conditions;
  },
});

export type LookupStatus = 'INIT' | 'DONE' | 'INCOMPLETE';

export const lookupStatusState = atomFamily<LookupStatus, string>({
  key: `${PREFIX}/lookupStatusState`,
  default: 'INIT',
});
