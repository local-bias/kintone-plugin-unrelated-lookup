import { isAlreadyLookupedAtom } from '@/desktop/states';
import {
  getCurrentRecord,
  getFieldValueAsString,
  setCurrentRecord,
} from '@konomi-app/kintone-utilities';
import { useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { clearLookup, lookup } from '../action';
import { useAttachmentProps } from '../components/attachment-context';
import {
  isRecordCacheEnabledAtom,
  loadingCountAtom,
  pluginConditionAtom,
  searchInputAtom,
} from '../states';
import { dialogPageIndexAtom, isDialogShownAtom } from '../states/dialog';
import { currentRecordAtom } from '../states/kintone';

export const useLookup = () => {
  const attachmentProps = useAttachmentProps();
  const { enqueueSnackbar } = useSnackbar();
  const setShown = useSetAtom(isDialogShownAtom(attachmentProps));

  const start = useAtomCallback(
    useCallback(
      async (get, set) => {
        const { conditionId, rowIndex } = attachmentProps;
        try {
          set(loadingCountAtom(conditionId), (c) => c + 1);
          set(isAlreadyLookupedAtom(attachmentProps), false);
          set(dialogPageIndexAtom(attachmentProps), 1);
          set(isRecordCacheEnabledAtom(conditionId), true);

          const condition = get(pluginConditionAtom(conditionId));

          const { record } = getCurrentRecord();
          set(currentRecordAtom, record);
          let input = getFieldValueAsString(record[condition.dstField]);

          set(searchInputAtom(attachmentProps), input);

          if (!input) {
            set(isDialogShownAtom(attachmentProps), true);
            return;
          }

          const lookuped = await lookup({
            condition,
            record,
            attachmentProps,
            option: { input, enqueueSnackbar, setShown },
          });

          setCurrentRecord({ record: lookuped });
        } catch (error) {
          console.error(error);
          if (error instanceof Error) {
            enqueueSnackbar(error.message, { variant: 'error' });
          } else {
            enqueueSnackbar('ルックアップ時にエラーが発生しました', { variant: 'error' });
          }
          throw error;
        } finally {
          set(loadingCountAtom(conditionId), (c) => c - 1);
        }
      },
      [attachmentProps]
    )
  );

  const clear = useAtomCallback(
    useCallback(
      async (get, set) => {
        const { conditionId } = attachmentProps;
        const condition = get(pluginConditionAtom(conditionId));
        await clearLookup({ condition, attachmentProps });
        enqueueSnackbar('参照先フィールドをクリアしました', { variant: 'success' });
      },
      [attachmentProps]
    )
  );

  return { start, clear };
};
