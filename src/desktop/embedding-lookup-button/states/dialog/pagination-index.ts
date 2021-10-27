import { atom } from 'recoil';

const state = atom<number>({
  key: 'dialogPageIndexState',
  default: 1,
});

export default state;
