import { atom } from 'jotai';
import { areAttachmentsEqual, AttachmentAtomParams, pluginConditionAtom, searchInputAtom } from '.';
import { kintoneAPI, getYuruChara } from '@konomi-app/kintone-utilities';
import { atomFamily } from 'jotai/utils';
import { dialogPageChunkAtom, dialogPageIndexAtom } from './dialog';
import { isProd } from '@/lib/global';

export type HandledRecord = { __quickSearch: string; record: kintoneAPI.RecordData };

export const srcAllRecordsAtom = atomFamily((_conditionId: string) => atom<HandledRecord[]>([]));

export const filteredRecordsAtom = atomFamily(
  (params: AttachmentAtomParams) =>
    atom<kintoneAPI.RecordData[]>((get) => {
      const { conditionId } = params;
      const condition = get(pluginConditionAtom(conditionId));
      const cachedRecords = get(srcAllRecordsAtom(conditionId));
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
      const filtered = cachedRecords.filter(({ __quickSearch }) =>
        words.every((word) => ~__quickSearch.indexOf(word))
      );

      !isProd &&
        console.log({
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
