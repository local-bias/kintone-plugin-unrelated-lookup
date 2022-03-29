import { cleanseStorage, restoreStorage } from '@common/plugin';
import { lookup } from '../embedding-lookup-button/action';
import { lookupObserver } from '../lookup-observer';

const events: launcher.EventTypes = ['app.record.create.submit', 'app.record.edit.submit.success'];

const action: launcher.Action = async (event, pluginId) => {
  const { conditions } = cleanseStorage(restoreStorage(pluginId));

  const targetConditions = conditions.filter(
    (condition) => condition.srcField && condition.srcAppId && condition.saveAndLookup
  );

  if (!targetConditions.length) {
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
      const lookuped = await lookup(condition, event.record);

      console.log({ lookuped });

      event.record = lookuped;
    } catch (error) {
      console.error({ error });
      if (typeof error === 'string') {
        event.record[condition.dstField].error = error;
        event.error = `${condition.dstField}のルックアップを実行しましたが、${error}`;
      } else if (
        error instanceof Error ||
        (typeof error === 'object' && !!error && error.hasOwnProperty('message'))
      ) {
        //@ts-ignore
        event.record[condition.dstField].error = error.message;
        //@ts-ignore
        event.error = `${condition.dstField}のルックアップを実行しましたが、${error.message}`;
      } else {
        event.record[condition.dstField].error = '入力値に誤りがあります';
        event.error = `${condition.dstField}のルックアップを実行しましたが、正しく取得することができませんでした。入力値に誤りがないか確認してください。`;
      }
    }
  }

  return event;
};

export default { events, action };
