import { cleanse, restorePluginConfig } from '@/common/plugin';
import { lookupObserver } from '../lookup-observer';
import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { listener } from '@/common/listener';

const events: kintoneAPI.js.EventType[] = ['app.record.create.submit', 'app.record.edit.submit'];

listener.add(events, async (event) => {
  const { conditions } = cleanse(restorePluginConfig());

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
      !lookupObserver[condition.dstField] ||
      condition.saveAndLookup
    ) {
      continue;
    }

    // レコード編集開始時から値が変更されており、かつルックアップが実行されていない場合はエラー
    if (
      lookupObserver[condition.dstField].atStart !== event.record[condition.dstField].value &&
      !lookupObserver[condition.dstField].lookuped
    ) {
      //@ts-ignore
      event.record[condition.dstField].error = '[取得]を押し、参照先からデータを取得してください。';
      event.error = 'ルックアップが完了していないフィールドが存在します';
      continue;
    }
  }

  return event;
});
