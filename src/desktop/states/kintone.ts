import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { atom, atomFamily } from 'recoil';
import { HandledRecord } from '../embedding-lookup-button/states/records';

const PREFIX = 'kintone';

export const currentKintoneEventState = atom<kintoneAPI.js.EventType | null>({
  key: `${PREFIX}/currentKintoneEventState`,
  default: null,
});

export const allSrcRecordsState = atomFamily<HandledRecord[], string>({
  key: `${PREFIX}/allSrcRecordsState`,
  default: [],
});
