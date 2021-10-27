import { atom } from 'recoil';

const state = atom<string>({ key: 'dialogTitleState', default: 'ルックアップ' });

export default state;
