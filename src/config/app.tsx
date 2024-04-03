import { PluginErrorBoundary } from '@/lib/components/error-boundary';
import { URL_PROMOTION } from '@/lib/statics';
import {
  Notification,
  PluginBanner,
  PluginConfigProvider,
  PluginLayout,
} from '@konomi-app/kintone-utilities-react';
import { LoaderWithLabel } from '@konomi-app/ui-react';
import { SnackbarProvider } from 'notistack';
import React, { FC, Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import config from '../../plugin.config.mjs';
import Footer from './components/model/footer';
import Form from './components/model/form';
import Sidebar from './components/model/sidebar';

const Component: FC = () => (
  <>
    <RecoilRoot>
      <PluginErrorBoundary>
        <PluginConfigProvider config={config}>
          <Notification />
          <SnackbarProvider maxSnack={1}>
            <PluginLayout>
              <Suspense fallback={<LoaderWithLabel label='設定情報を取得しています' />}>
                <Sidebar />
                <Form />
                <PluginBanner url='https://promotion.konomi.app/kintone-plugin/sidebar' />
                <Footer />
              </Suspense>
            </PluginLayout>
          </SnackbarProvider>
        </PluginConfigProvider>
      </PluginErrorBoundary>
    </RecoilRoot>
    <iframe title='promotion' loading='lazy' src={URL_PROMOTION} className='border-0 w-full h-16' />
  </>
);

export default Component;
