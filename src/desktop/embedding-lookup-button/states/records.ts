import { isProd } from '@/lib/global';
import {
  getFieldValueAsString,
  getYuruChara,
  kintoneAPI,
  sortField,
} from '@konomi-app/kintone-utilities';
import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { areAttachmentsEqual, AttachmentAtomParams, pluginConditionAtom, searchInputAtom } from '.';
import { dialogPageChunkAtom, dialogPageIndexAtom } from './dialog';

export type HandledRecord = { __quickSearch: string; record: kintoneAPI.RecordData };

export const srcAllRawRecordsAtom = atomFamily((_conditionId: string) =>
  atom<kintoneAPI.RecordData[]>([])
);

const srcAllSortedRecordsAtom = atomFamily((conditionId: string) =>
  atom<kintoneAPI.RecordData[]>((get) => {
    const condition = get(pluginConditionAtom(conditionId));
    const records = get(srcAllRawRecordsAtom(conditionId));

    const sortCriteria = condition.sortCriteria.filter(({ fieldCode }) => !!fieldCode);

    return records.toSorted((a, b) => {
      for (const { fieldCode, order } of sortCriteria) {
        const aField = a[fieldCode];
        const bField = b[fieldCode];

        if (!aField || !bField) {
          continue;
        }

        const sortResult = sortField(aField, bField);
        if (sortResult === 0) {
          continue;
        }
        return order === 'asc' ? sortResult : -sortResult;
      }
      return 0;
    });
  })
);

export const srcAllHandledRecordsAtom = atomFamily((conditionId: string) =>
  atom<HandledRecord[]>((get) => {
    const condition = get(pluginConditionAtom(conditionId));
    const rawRecords = get(srcAllSortedRecordsAtom(conditionId));

    const {
      isCaseSensitive,
      isKatakanaSensitive,
      isZenkakuEisujiSensitive,
      isHankakuKatakanaSensitive,
    } = condition;

    return rawRecords.map((record) => {
      let __quickSearch = Object.values(record)
        .filter((field) => field.type !== '__ID__')
        .map((field) => getFieldValueAsString(field))
        .join('__');

      __quickSearch = getYuruChara(__quickSearch, {
        isCaseSensitive,
        isKatakanaSensitive,
        isZenkakuEisujiSensitive,
        isHankakuKatakanaSensitive,
      });

      return { record, __quickSearch };
    });
  })
);

export const filteredRecordsAtom = atomFamily(
  (params: AttachmentAtomParams) =>
    atom<kintoneAPI.RecordData[]>((get) => {
      const { conditionId } = params;
      const condition = get(pluginConditionAtom(conditionId));
      const records = get(srcAllHandledRecordsAtom(conditionId));
      const text = get(searchInputAtom(params));

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
      const filtered = records.filter(({ __quickSearch }) =>
        words.every((word) => ~__quickSearch.indexOf(word))
      );

      !isProd &&
        console.log(`🔎 applied text filtering`, {
          conditionId,
          rowIndex: params.rowIndex,
          text,
          recordLength: filtered.length,
        });

      return filtered.map(({ record }) => record);
    }),
  areAttachmentsEqual
);

export const displayingRecordsAtom = atomFamily(
  (params: AttachmentAtomParams) =>
    atom<kintoneAPI.RecordData[]>((get) => {
      const { conditionId } = params;
      const records = get(filteredRecordsAtom(params));
      const index = get(dialogPageIndexAtom(params));
      const chunk = get(dialogPageChunkAtom(conditionId));
      return records.slice((index - 1) * chunk, index * chunk);
    }),
  areAttachmentsEqual
);
