import { isProd } from '@/lib/global';
import { t } from '@/lib/i18n';
import { getCurrentRecord, setCurrentRecord } from '@konomi-app/kintone-utilities';
import { TextField } from '@mui/material';
import { useAtom, useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { useSnackbar } from 'notistack';
import { ChangeEventHandler, forwardRef, KeyboardEventHandler, useCallback } from 'react';
import { apply } from '../../action';
import { pluginConditionAtom, searchInputAtom } from '../../states';
import { dialogLoadingAtom, dialogPageIndexAtom, isDialogShownAtom } from '../../states/dialog';
import { filteredRecordsAtom } from '../../states/records';
import { useAttachmentProps } from '../attachment-context';

const DialogSearchInputContainer = forwardRef<HTMLInputElement>((_, ref) => {
  const attachmentProps = useAttachmentProps();
  const { enqueueSnackbar } = useSnackbar();
  const [value, setValue] = useAtom(searchInputAtom(attachmentProps));
  const setPageIndex = useSetAtom(dialogPageIndexAtom(attachmentProps));

  !isProd &&
    console.log('🔍 DialogSearchInputContainer', {
      conditionId: attachmentProps.conditionId,
      rowIndex: attachmentProps.rowIndex,
      value: value,
    });

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
    setPageIndex(1);
  };

  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = useAtomCallback(
    useCallback(
      async (get, set, event) => {
        if (event.key !== 'Enter') {
          return;
        }
        const filteredRecords = get(filteredRecordsAtom(attachmentProps));
        if (filteredRecords.length !== 1) {
          return;
        }
        try {
          set(dialogLoadingAtom(attachmentProps), true);
          const condition = get(pluginConditionAtom(attachmentProps.conditionId));
          const { record } = getCurrentRecord();
          const applied = await apply({
            condition,
            targetRecord: record,
            sourceRecord: filteredRecords[0],
            attachmentProps,
            option: { enqueueSnackbar },
          });
          setCurrentRecord({ record: applied });
          set(isDialogShownAtom(attachmentProps), false);
        } finally {
          set(dialogLoadingAtom(attachmentProps), false);
        }
      },
      [attachmentProps, enqueueSnackbar]
    )
  );

  return (
    <TextField
      inputRef={ref}
      label={t('desktop.lookupDialog.searchInput.label')}
      variant='outlined'
      color='primary'
      size='small'
      onKeyDown={onKeyDown}
      {...{ value, onChange }}
    />
  );
});
DialogSearchInputContainer.displayName = 'DialogSearchInputContainer';

export default DialogSearchInputContainer;
