import React, { VFC } from 'react';
import { RecoilRoot } from 'recoil';
import { SnackbarProvider } from 'notistack';

import { pluginConditionState } from './states';

import SrcCacheController from './components/src-cache-controller';
import LookupButton from './components/lookup-button';
import SearchDialog from './components/dialog';

type Props = { condition: kintone.plugin.Condition };

const Component: VFC<Props> = ({ condition }) => (
  <RecoilRoot
    initializeState={({ set }) => {
      set(pluginConditionState, condition);
    }}
  >
    <SrcCacheController />
    <SnackbarProvider maxSnack={1}>
      <LookupButton />
      <SearchDialog />
    </SnackbarProvider>
  </RecoilRoot>
);

export default Component;
