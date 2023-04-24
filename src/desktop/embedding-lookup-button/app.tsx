import React, { FC } from 'react';
import { RecoilRoot } from 'recoil';
import { SnackbarProvider } from 'notistack';

import { pluginConditionState, guestSpaceIdState } from './states';

import EventObserver from './components/event-observer';
import SrcCacheController from './components/src-cache-controller';
import LookupStatusBadge from './components/lookup-status-badge';
import LookupButton from './components/lookup-button';
import SearchDialog from './components/dialog';

type Props = { condition: kintone.plugin.Condition; guestSpaceId: string | null };

const Component: FC<Props> = ({ condition, guestSpaceId }) => (
  <RecoilRoot
    initializeState={({ set }) => {
      set(pluginConditionState, condition);
      set(guestSpaceIdState, guestSpaceId);
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
