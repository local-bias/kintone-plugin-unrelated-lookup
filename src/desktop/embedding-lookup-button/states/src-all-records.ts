import { Record as KintoneRecord } from '@kintone/rest-api-client/lib/client/types';
import { atom } from 'recoil';

export const state = atom<KintoneRecord[]>({ key: 'srcAllRecordsState', default: [] });

export default state;
