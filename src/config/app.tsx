import { SnackbarProvider } from 'notistack';
import React, { FC, Suspense } from 'react';
import { RecoilRoot } from 'recoil';

import { ErrorBoundary } from '@common/components/error-boundary';
import { restoreStorage } from '@common/plugin';

import { PluginLayout, PluginBanner } from '@konomi-app/kintone-utility-component';
import Form from './components/model/form';
import Footer from './components/model/footer';
import Sidebar from './components/model/sidebar';

import { Loading } from '@common/components/loading';
import { URL_PROMOTION } from '@common/statics';
import { pluginIdState, storageState } from './states/plugin';

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
          <PluginLayout>
            <Suspense fallback={<Loading label='設定情報を取得しています' />}>
              <Sidebar />
              <Form />
              <PluginBanner url='https://promotion.konomi.app/kintone-plugin/sidebar' />
              <Footer />
            </Suspense>
          </PluginLayout>
        </SnackbarProvider>
      </ErrorBoundary>
    </RecoilRoot>
    <iframe
      title='promotion'
      loading='lazy'
      src={URL_PROMOTION}
      style={{ border: '0', width: '100%', height: '64px' }}
    />
  </>
);

export default Component;
