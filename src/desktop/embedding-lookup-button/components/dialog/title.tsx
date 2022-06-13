import React, { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { dialogTitleState } from '../../states';
import { DialogTitle } from '@mui/material';

type Props = Readonly<{ title: string }>;

const Component: FC<Props> = ({ title }) => <DialogTitle>{title}</DialogTitle>;

const Container: FC = () => {
  const title = useRecoilValue(dialogTitleState);
  return <Component {...{ title }} />;
};

export default Container;
