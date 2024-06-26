import { cleanse, restorePluginConfig } from '@/lib/plugin';
import { lookup } from '../embedding-lookup-button/action';
import { lookupObserver } from '../lookup-observer';
import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { listener } from '@/lib/listener';

const events: kintoneAPI.js.EventType[] = ['app.record.create.submit', 'app.record.edit.submit'];

listener.add(events, async (event) => {
  const { conditions } = cleanse(restorePluginConfig());

  const targetConditions = conditions.filter(
    (condition) => condition.srcField && condition.srcAppId && condition.saveAndLookup
  );

  if (!targetConditions.length) {
    process?.env?.NODE_ENV === 'development' && console.log('targetConditions is empty');
    return event;
  }

  for (const condition of targetConditions) {
    try {
      // 次の場合は処理の対象外
      // 1. プラグインに設定されているフィールド情報が不正
      // 2. 対象フィールドに値が設定されていない
      // 3. ユーザーの操作によってルックアップが実行されている場合
      if (
        !event.record[condition.dstField] ||
        !event.record[condition.dstField].value ||
        lookupObserver[condition.dstField].lookuped
      ) {
        continue;
      }

      /** 取得した関連レコード */
      const lookuped = await lookup({ condition, record: event.record });

      if (process?.env?.NODE_ENV === 'development') {
        console.log({ lookuped });
        await new Promise((resolve) => setTimeout(resolve, 1000 * 20));
      }

      event.record = lookuped;
    } catch (error: any) {
      console.error({ error });
      if (typeof error === 'string') {
        //@ts-expect-error dts-genの型情報に`error`プロパティが存在しないため
        event.record[condition.dstField].error = error;
        event.error = `${condition.dstField}のルックアップを実行しましたが、${error}`;
      } else if (
        error instanceof Error ||
        (typeof error === 'object' && !!error && error.hasOwnProperty('message'))
      ) {
        //@ts-expect-error dts-genの型情報に`error`プロパティが存在しないため
        event.record[condition.dstField].error = error.message;
        event.error = `${condition.dstField}のルックアップを実行しましたが、${error.message}`;
      } else {
        //@ts-expect-error dts-genの型情報に`error`プロパティが存在しないため
        event.record[condition.dstField].error = '入力値に誤りがあります';
        event.error = `${condition.dstField}のルックアップを実行しましたが、正しく取得することができませんでした。入力値に誤りがないか確認してください。`;
      }
    }
  }

  return event;
});
