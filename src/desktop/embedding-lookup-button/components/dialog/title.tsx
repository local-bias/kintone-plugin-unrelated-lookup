import { DialogTitle } from '@mui/material';
import { useAtomValue } from 'jotai';
import React, { FC } from 'react';
import { dialogTitleAtom } from '../../states/dialog';
import { useConditionId } from '../condition-id-context';

const Container: FC = () => {
  const conditionId = useConditionId();
  const title = useAtomValue(dialogTitleAtom(conditionId));
  return <DialogTitle>{title}</DialogTitle>;
};

export default Container;
