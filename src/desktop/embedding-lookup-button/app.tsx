import { SnackbarProvider } from 'notistack';
import React, { FC } from 'react';
import { ConditionIdProvider } from './components/condition-id-context';
import SearchDialog from './components/dialog';
import EventObserver from './components/event-observer';
import LookupButton from './components/lookup-button';
import LookupStatusBadge from './components/lookup-status-badge';
import SrcCacheController from './components/src-cache-controller';
import { Provider } from 'jotai';
import { store } from '@/lib/store';

type Props = { conditionId: string };

const App: FC<Props> = ({ conditionId }) => (
  <Provider store={store}>
    <ConditionIdProvider conditionId={conditionId}>
      <SrcCacheController />
      <LookupStatusBadge />
      <SnackbarProvider maxSnack={1}>
        <EventObserver />
        <LookupButton />
        <SearchDialog />
      </SnackbarProvider>
    </ConditionIdProvider>
  </Provider>
);

export default App;
