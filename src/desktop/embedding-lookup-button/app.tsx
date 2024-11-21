import { store } from '@/lib/store';
import { Provider } from 'jotai';
import { SnackbarProvider } from 'notistack';
import { FC } from 'react';
import { AttachmentPropsProvider } from './components/attachment-context';
import SearchDialog from './components/dialog';
import EventObserver from './components/event-observer';
import LookupButton from './components/lookup-button';
import LookupStatusBadge from './components/lookup-status-badge';
import { PluginErrorBoundary } from '@/lib/components/error-boundary';

export type AttachmentProps = { conditionId: string; rowIndex?: number };

const App: FC<AttachmentProps> = (props) => (
  <Provider store={store}>
    <PluginErrorBoundary>
      <AttachmentPropsProvider {...props}>
        <LookupStatusBadge />
        <SnackbarProvider maxSnack={1}>
          <EventObserver />
          <LookupButton />
          <SearchDialog />
        </SnackbarProvider>
      </AttachmentPropsProvider>
    </PluginErrorBoundary>
  </Provider>
);

export default App;
