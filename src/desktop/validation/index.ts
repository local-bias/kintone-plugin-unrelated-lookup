import { cleanseStorage, restoreStorage } from '@common/plugin';
import { lookupObserver } from '../lookup-observer';

const events: launcher.EventTypes = ['app.record.create.submit', 'app.record.edit.submit'];

const action: launcher.Action = async (event, pluginId) => {
  const { conditions } = cleanseStorage(restoreStorage(pluginId));

  const targetConditions = conditions.filter(
    (condition) => condition.srcField && condition.srcAppId && condition.enablesValidation
  );

  if (!targetConditions.length) {
    return event;
  }

  for (const condition of targetConditions) {
    if (
      !event.record[condition.dstField] ||
      !event.record[condition.dstField].value ||
      !lookupObserver[condition.dstField]
    ) {
      continue;
    }

    // レコード編集開始時から値が変更されており、かつルックアップが実行されていない場合はエラー
    if (
      lookupObserver[condition.dstField].atStart !== event.record[condition.dstField].value &&
      !lookupObserver[condition.dstField].lookuped
    ) {
      event.record[condition.dstField].error = '[取得]を押し、参照先からデータを取得してください。';
      event.error = 'ルックアップが完了していないフィールドが存在します';
      continue;
    }
  }

  return event;
};

export default { action, events };
