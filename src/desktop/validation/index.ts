import { cleanse, restorePluginConfig } from '@/lib/plugin';
import { lookupObserver } from '../lookup-observer';
import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { listener } from '@/lib/listener';
import { ENV } from '@/lib/global';
import { PLUGIN_NAME } from '@/lib/statics';

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
    const { id, dstField, saveAndLookup } = condition;
    if (!event.record[dstField]?.value || !lookupObserver[id] || saveAndLookup) {
      continue;
    }

    const { valueAtStart, lookuped } = lookupObserver[id];
    const currentValue = event.record[dstField].value;

    // レコード編集開始時から値が変更されており、かつルックアップが実行されていない場合はエラー
    if (valueAtStart !== currentValue && !lookuped) {
      //@ts-expect-error dts-genの型情報に`error`プロパティが存在しないため
      event.record[dstField].error = '[取得]を押し、参照先からデータを取得してください。';
      event.error = 'ルックアップが完了していないフィールドが存在します';
      continue;
    }
  }

  ENV === 'development' && console.log(`[${PLUGIN_NAME}] Validation has been completed`);

  return event;
});
