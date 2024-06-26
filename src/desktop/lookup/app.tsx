import React, { FC } from 'react';
import { RecoilRoot } from 'recoil';
import { useKintoneEvent } from '../hooks/use-kintone-event';
import Debug from './components/debug';
import Inputs from './components/input';
import { useInitializeRecords } from '../hooks/use-initialize-records';
import { useInitializeInput } from '../hooks/use-initialize-input';

type Props = {};

const Component: FC<Props> = () => {
  useKintoneEvent();
  useInitializeInput();
  useInitializeRecords();

  return (
    <>
      <Debug />
      <Inputs />
    </>
  );
};

const Container: FC<Props> = (props) => (
  <RecoilRoot>
    <Component {...props} />
  </RecoilRoot>
);

export default Container;
