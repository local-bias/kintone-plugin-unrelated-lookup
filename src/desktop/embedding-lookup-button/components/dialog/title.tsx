import { DialogTitle } from '@mui/material';
import { useAtomValue } from 'jotai';
import { FC, Suspense } from 'react';
import { dialogTitleAtom } from '../../states/dialog';
import { useConditionId } from '../attachment-context';

const DialogTitleComponent: FC = () => {
  const conditionId = useConditionId();
  const title = useAtomValue(dialogTitleAtom(conditionId));
  return <DialogTitle>{title}</DialogTitle>;
};

const DialogTitleContainer: FC = () => {
  return (
    <Suspense fallback={<DialogTitle>アプリからデータを取得</DialogTitle>}>
      <DialogTitleComponent />
    </Suspense>
  );
};

export default DialogTitleContainer;
