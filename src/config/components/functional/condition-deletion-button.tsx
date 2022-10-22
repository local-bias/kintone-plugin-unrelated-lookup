import React, { FC } from 'react';
import { useRecoilCallback } from 'recoil';
import { produce } from 'immer';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { storageState } from '../../states/plugin';
import { useConditionIndex } from './condition-index-provider';

type Props = Readonly<{ onClick: () => void }>;

const Component: FC<Props> = ({ onClick }) => (
  <IconButton {...{ onClick }}>
    <DeleteIcon fontSize='small' />
  </IconButton>
);

const Container: FC = () => {
  const index = useConditionIndex();
  const onClick = useRecoilCallback(
    ({ set }) =>
      () => {
        set(storageState, (_, _storage = _!) =>
          produce(_storage, (draft) => {
            draft.conditions.splice(index, 1);
          })
        );
      },
    [index]
  );

  return <Component {...{ onClick }} />;
};

export default Container;
