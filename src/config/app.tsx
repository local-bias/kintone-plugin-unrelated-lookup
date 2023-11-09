import { SnackbarProvider } from 'notistack';
import React, { FC, Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { LoaderWithLabel } from '@konomi-app/ui-react';

import { PluginErrorBoundary } from '@/common/components/error-boundary';
import { PluginLayout, PluginBanner } from '@konomi-app/kintone-utilities-react';
import Form from './components/model/form';
import Footer from './components/model/footer';
import Sidebar from './components/model/sidebar';
import { URL_PROMOTION } from '@/common/statics';

const Component: FC = () => (
  <>
    <RecoilRoot>
      <PluginErrorBoundary>
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
      </PluginErrorBoundary>
    </RecoilRoot>
    <iframe title='promotion' loading='lazy' src={URL_PROMOTION} className='border-0 w-full h-16' />
  </>
);

export default Component;
