import { atom, selector } from 'recoil';
import {
  dialogPageChunkState,
  dialogPageIndexState,
  pluginConditionState,
  searchInputState,
} from '.';
import { kintoneAPI, getYuruChara } from '@konomi-app/kintone-utilities';

export type HandledRecord = { __quickSearch: string; record: kintoneAPI.RecordData };

export const srcAllRecordsState = atom<HandledRecord[]>({
  key: 'srcAllRecordsState',
  default: [],
});

export const filteredRecordsState = selector<kintoneAPI.RecordData[]>({
  key: 'filteredRecordsState',
  get: ({ get }) => {
    const condition = get(pluginConditionState);
    const cachedRecords = get(srcAllRecordsState);
    const text = get(searchInputState);

    const {
      isCaseSensitive,
      isKatakanaSensitive,
      isZenkakuEisujiSensitive,
      isHankakuKatakanaSensitive,
    } = condition || {};

    let input = getYuruChara(text, {
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
  },
});

export const displayingRecordsState = selector<kintoneAPI.RecordData[]>({
  key: 'displayingRecordsState',
  get: ({ get }) => {
    const records = get(filteredRecordsState);
    const index = get(dialogPageIndexState);
    const chunk = get(dialogPageChunkState);

    return records.slice((index - 1) * chunk, index * chunk);
  },
});
