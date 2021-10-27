import React, { VFC } from 'react';
import { useRecoilValue } from 'recoil';
import { dialogTitleState } from '../../states';
import { DialogTitle } from '@mui/material';

type Props = Readonly<{ title: string }>;

const Component: VFC<Props> = ({ title }) => <DialogTitle>{title}</DialogTitle>;

const Container: VFC = () => {
  const title = useRecoilValue(dialogTitleState);
  return <Component {...{ title }} />;
};

export default Container;
