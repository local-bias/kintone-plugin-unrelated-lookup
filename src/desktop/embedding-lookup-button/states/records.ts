import {
  convertHankakuKatakanaToZenkaku,
  convertKatakanaToHiragana,
  convertZenkakuEisujiToHankaku,
} from '@/common/utilities';
import { atom, selector } from 'recoil';
import {
  dialogPageChunkState,
  dialogPageIndexState,
  pluginConditionState,
  searchInputState,
} from '.';
import { kintoneAPI } from '@konomi-app/kintone-utilities';

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
      ignoresLetterCase = true,
      ignoresKatakana = true,
      ignoresHankakuKatakana = true,
      ignoresZenkakuEisuji = true,
    } = condition || {};

    let input = text;

    if (ignoresZenkakuEisuji) {
      input = convertZenkakuEisujiToHankaku(input);
    }

    if (ignoresLetterCase) {
      input = input.toLowerCase();
    }

    if (ignoresHankakuKatakana) {
      input = convertHankakuKatakanaToZenkaku(input);
    }

    if (ignoresKatakana) {
      input = convertKatakanaToHiragana(input);
    }

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
