import { atom } from 'jotai';
import { pluginConditionAtom, searchInputAtom } from '.';
import { kintoneAPI, getYuruChara } from '@konomi-app/kintone-utilities';
import { atomFamily } from 'jotai/utils';
import { dialogPageChunkAtom, dialogPageIndexAtom } from './dialog';

export type HandledRecord = { __quickSearch: string; record: kintoneAPI.RecordData };

export const srcAllRecordsAtom = atomFamily((conditionId: string) => atom<HandledRecord[]>([]));

export const filteredRecordsAtom = atomFamily((conditionId: string) =>
  atom<kintoneAPI.RecordData[]>((get) => {
    const condition = get(pluginConditionAtom(conditionId));
    const cachedRecords = get(srcAllRecordsAtom(conditionId));
    const text = get(searchInputAtom(conditionId));

    const {
      isCaseSensitive,
      isKatakanaSensitive,
      isZenkakuEisujiSensitive,
      isHankakuKatakanaSensitive,
    } = condition || {};

    const input = getYuruChara(text, {
      isCaseSensitive,
      isKatakanaSensitive,
      isZenkakuEisujiSensitive,
      isHankakuKatakanaSensitive,
    });

    const words = input.split(/\s+/g);
    const filtered = cachedRecords.filter(({ __quickSearch }) =>
      words.every((word) => ~__quickSearch.indexOf(word))
    );

    return filtered.map(({ record }) => record);
  })
);

export const displayingRecordsAtom = atomFamily((conditionId: string) =>
  atom<kintoneAPI.RecordData[]>((get) => {
    const records = get(filteredRecordsAtom(conditionId));
    const index = get(dialogPageIndexAtom(conditionId));
    const chunk = get(dialogPageChunkAtom(conditionId));
    return records.slice((index - 1) * chunk, index * chunk);
  })
);
