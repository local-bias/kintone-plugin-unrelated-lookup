import { TextField } from '@mui/material';
import { useAtom, useSetAtom } from 'jotai';
import { ChangeEventHandler, FC } from 'react';
import { searchInputAtom } from '../../states';
import { dialogPageIndexAtom } from '../../states/dialog';
import { useAttachmentProps } from '../attachment-context';
import { isProd } from '@/lib/global';

const DialogSearchInputContainer: FC = () => {
  const attachmentProps = useAttachmentProps();
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

  return (
    <TextField
      label='レコードを検索'
      variant='outlined'
      color='primary'
      size='small'
      {...{ value, onChange }}
    />
  );
};

export default DialogSearchInputContainer;
