import React, { Suspense, FC } from 'react';
import { RecoilRoot } from 'recoil';
import { SnackbarProvider } from 'notistack';

import { restoreStorage } from '@common/plugin';
import { ErrorBoundary } from '@common/components/error-boundary';

import Form from './components/model';
import Footer from './components/model/footer';
import Promotion from './components/ui/promotion';

import { pluginIdState, storageState } from './states/plugin';
import { Loading } from '@common/components/loading';

const Component: FC<{ pluginId: string }> = ({ pluginId }) => (
  <>
    <RecoilRoot
      initializeState={({ set }) => {
        set(pluginIdState, pluginId);
        set(storageState, restoreStorage(pluginId));
      }}
    >
      <ErrorBoundary>
        <SnackbarProvider maxSnack={1}>
          <Suspense fallback={<Loading label='設定情報を取得しています' />}>
            <Form />
            <Footer />
          </Suspense>
        </SnackbarProvider>
      </ErrorBoundary>
    </RecoilRoot>
    <Promotion />
  </>
);

export default Component;
