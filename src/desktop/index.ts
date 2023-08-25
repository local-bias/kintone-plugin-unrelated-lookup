import '@/common/global';
import { pushPluginName } from '@/common/local-storage';
import { PLUGIN_NAME } from '@/common/statics';
import { KintoneEventListener } from '@konomi-app/kintone-utilities';
import embedLookupButton from './embedding-lookup-button';
import initializeObserver from './initialize-observer';
import onSave from './on-save';
import validation from './validation';

((pluginId) => {
  try {
    pushPluginName();
  } catch (error) {}
  const listener = new KintoneEventListener({
    pluginId,
    errorHandler: (error, props) => {
      const { event } = props;
      event.error = `プラグイン「${PLUGIN_NAME}」の処理内でエラーが発生しました。`;
      console.error('エラー', error);
    },
    logDisabled: process.env.NODE_ENV === 'production',
  });
  initializeObserver(listener);
  embedLookupButton(listener);
  validation(listener);
  onSave(listener);
})(kintone.$PLUGIN_ID);
