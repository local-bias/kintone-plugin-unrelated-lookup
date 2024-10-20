import { KintoneEventManager } from '@konomi-app/kintone-utilities';
import { PLUGIN_NAME } from './statics';
import { ENV } from './global';

export const listener = new KintoneEventManager({
  errorHandler: (error, props) => {
    const { event } = props;
    event.error = `プラグイン「${PLUGIN_NAME}」の処理内でエラーが発生しました。`;
    console.error('エラー', error);
    return event;
  },
  logDisabled: process.env.NODE_ENV === 'production',
});

ENV === 'development' && console.info('[plugin] Event listener has been initialized');
