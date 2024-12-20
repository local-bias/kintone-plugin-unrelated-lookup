import { PluginErrorBoundary } from '@/lib/components/error-boundary';
import { MUIThemeProvider } from '@/lib/components/theme-provider';
import { URL_BANNER, URL_PROMOTION } from '@/lib/constants';
import {
  Notification,
  PluginBanner,
  PluginConfigProvider,
  PluginContent,
  PluginLayout,
} from '@konomi-app/kintone-utilities-react';
import { LoaderWithLabel } from '@konomi-app/ui-react';
import { SnackbarProvider } from 'notistack';
import { FC, Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import config from '../../plugin.config.mjs';
import Footer from './components/model/footer';
import Form from './components/model/form';
import Sidebar from './components/sidebar';

const App: FC = () => {
  return (
    <>
      <Sidebar />
      <PluginContent>
        <PluginErrorBoundary>
          <Form />
        </PluginErrorBoundary>
      </PluginContent>
      <PluginBanner url={URL_BANNER} />
      <Footer />
    </>
  );
};

const AppContainer: FC = () => (
  <Suspense fallback={<LoaderWithLabel label='画面の描画を待機しています' />}>
    <MUIThemeProvider>
      <RecoilRoot>
        <PluginErrorBoundary>
          <PluginConfigProvider config={config}>
            <Notification />
            <SnackbarProvider maxSnack={1}>
              <Suspense fallback={<LoaderWithLabel label='設定情報を取得しています' />}>
                <PluginLayout>
                  <App />
                </PluginLayout>
              </Suspense>
            </SnackbarProvider>
          </PluginConfigProvider>
        </PluginErrorBoundary>
      </RecoilRoot>
    </MUIThemeProvider>
    <iframe title='promotion' loading='lazy' src={URL_PROMOTION} className='border-0 w-full h-16' />
  </Suspense>
);

export default AppContainer;
