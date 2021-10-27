import { atom, selector } from 'recoil';
import { pluginConditionState } from '.';

const privateAtom = atom({ key: 'enablesCacheState', default: false });

const state = selector<boolean>({
  key: 'enableCacheControllerState',
  get: ({ get }) => {
    const currentState = get(privateAtom);
    if (currentState) {
      return true;
    }

    const condition = get(pluginConditionState);

    return condition?.enablesCache ?? false;
  },
  set: ({ set }, defaultValue) => {
    set(privateAtom, defaultValue);
  },
});

export default state;
