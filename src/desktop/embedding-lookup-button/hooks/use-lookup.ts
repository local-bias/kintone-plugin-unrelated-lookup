import { getCurrentRecord, setCurrentRecord } from '@lb-ribbit/kintone-xapp';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { clearLookup, lookup } from '../action';
import {
  alreadyCacheAtom,
  alreadyLookupAtom,
  isRecordCacheEnabledAtom,
  loadingCountAtom,
  pluginConditionAtom,
  searchInputAtom,
} from '../states';
import { srcAllRecordsAtom } from '../states/records';
import { dialogPageIndexAtom, isDialogShownAtom } from '../states/dialog';
import { useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';

export const useLookup = (conditionId: string) => {
  const { enqueueSnackbar } = useSnackbar();
  const setShown = useSetAtom(isDialogShownAtom(conditionId));
  const setAlreadyLookup = useSetAtom(alreadyLookupAtom(conditionId));

  const start = useAtomCallback(
    useCallback(
      async (get, set) => {
        try {
          set(loadingCountAtom(conditionId), (c) => c + 1);
          set(alreadyLookupAtom(conditionId), false);
          set(dialogPageIndexAtom(conditionId), 1);
          set(isRecordCacheEnabledAtom(conditionId), true);

          const condition = get(pluginConditionAtom(conditionId));

          const { record } = getCurrentRecord();
          const input = (record[condition.dstField].value as string) || '';
          set(searchInputAtom(conditionId), input);

          if (!input) {
            set(isDialogShownAtom(conditionId), true);
            return;
          }

          const hasCached = get(alreadyCacheAtom(conditionId));
          const handledRecords = get(srcAllRecordsAtom(conditionId));

          const cachedRecords = handledRecords.map(({ record }) => record);

          const lookuped = await lookup({
            condition,
            record,
            option: {
              input,
              hasCached,
              cachedRecords,
              enqueueSnackbar,
              setShown,
              setLookuped: setAlreadyLookup,
            },
          });

          setCurrentRecord({ record: lookuped });
        } catch (error) {
          console.error(error);
          enqueueSnackbar('ルックアップ時にエラーが発生しました', { variant: 'error' });
          throw error;
        } finally {
          set(loadingCountAtom(conditionId), (c) => c - 1);
        }
      },
      [conditionId]
    )
  );

  const clear = useAtomCallback(
    useCallback(
      async (get, set) => {
        const condition = get(pluginConditionAtom(conditionId));
        set(alreadyLookupAtom(conditionId), false);
        await clearLookup(condition);
        enqueueSnackbar('参照先フィールドをクリアしました', { variant: 'success' });
      },
      [conditionId]
    )
  );

  return { start, clear };
};
