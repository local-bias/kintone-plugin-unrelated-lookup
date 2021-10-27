import { atom } from 'recoil';

const state = atom<number>({ key: 'dialogPageChunkState', default: 80 });

export default state;
