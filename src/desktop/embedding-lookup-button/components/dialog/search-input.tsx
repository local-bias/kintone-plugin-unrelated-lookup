import React, { ChangeEventHandler, FC } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { TextField } from '@mui/material';

import { dialogPageIndexState, searchInputState } from '../../states';

type Props = {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

const Component: FC<Props> = ({ value, onChange }) => (
  <TextField
    label='レコードを検索'
    variant='outlined'
    color='primary'
    size='small'
    {...{ value, onChange }}
  />
);

const Container: FC = () => {
  const [value, setValue] = useRecoilState(searchInputState);
  const setPageIndex = useSetRecoilState(dialogPageIndexState);

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
    setPageIndex(1);
  };

  return <Component {...{ value, onChange }} />;
};

export default Container;
