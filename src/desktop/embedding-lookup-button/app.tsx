import React, { FC } from 'react';
import { RecoilRoot } from 'recoil';
import { SnackbarProvider } from 'notistack';

import { pluginConditionState } from './states';

import EventObserver from './components/event-observer';
import SrcCacheController from './components/src-cache-controller';
import LookupStatusBadge from './components/lookup-status-badge';
import LookupButton from './components/lookup-button';
import SearchDialog from './components/dialog';

type Props = { condition: kintone.plugin.Condition };

const Component: FC<Props> = ({ condition }) => (
  <RecoilRoot
    initializeState={({ set }) => {
      set(pluginConditionState, condition);
    }}
  >
    <SrcCacheController />
    <LookupStatusBadge />
    <SnackbarProvider maxSnack={1}>
      <EventObserver />
      <LookupButton />
      <SearchDialog />
    </SnackbarProvider>
  </RecoilRoot>
);

export default Component;
