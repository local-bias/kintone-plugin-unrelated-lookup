import { DialogTitle } from '@mui/material';
import { useAtomValue } from 'jotai';
import { FC } from 'react';
import { dialogTitleAtom } from '../../states/dialog';
import { useConditionId } from '../attachment-context';

const Container: FC = () => {
  const conditionId = useConditionId();
  const title = useAtomValue(dialogTitleAtom(conditionId));
  return <DialogTitle>{title}</DialogTitle>;
};

export default Container;
