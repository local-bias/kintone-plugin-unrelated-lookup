import { PLUGIN_NAME } from '@/common/statics';
import { KintoneEventListener } from '@konomi-app/kintone-utilities';
import { pushPluginName } from '@/common/local-storage';
import embedLookupButton from './embedding-lookup-button';
import validation from './validation';
import onSave from './on-save';
import initializeObserver from './initialize-observer';

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
