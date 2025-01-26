import { getDstField } from '@/desktop/common';
import { isAlreadyLookupedAtom } from '@/desktop/states';
import { t } from '@/lib/i18n';
import {
  getCurrentRecord,
  getFieldValueAsString,
  setCurrentRecord,
} from '@konomi-app/kintone-utilities';
import { Button } from '@mui/material';
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

          const dstField = getDstField({ condition, record, rowIndex });
          const input = dstField ? getFieldValueAsString(dstField) : '';

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
            enqueueSnackbar(t('desktop.toast.error.unknown'), { variant: 'error' });
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
        const { originalRecord } = await clearLookup({ condition, attachmentProps });

        const undo = () => {
          setCurrentRecord({ record: originalRecord });
          set(isAlreadyLookupedAtom(attachmentProps), true);
          enqueueSnackbar(t('desktop.toast.success.undo'), { variant: 'success' });
        };

        enqueueSnackbar(t('desktop.toast.success.clear'), {
          variant: 'success',
          action: (
            <Button onClick={undo} color='inherit' variant='outlined' size='small'>
              {t('desktop.toast.action.undo')}
            </Button>
          ),
        });
      },
      [attachmentProps]
    )
  );

  return { start, clear };
};
