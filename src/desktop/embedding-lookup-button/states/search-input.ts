import { atom } from 'recoil';

const state = atom<string>({ key: 'searchInputState', default: '' });

export default state;
