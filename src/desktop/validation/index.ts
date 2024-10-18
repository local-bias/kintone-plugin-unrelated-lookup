import { ENV } from '@/lib/global';
import { listener } from '@/lib/listener';
import { cleanse, restorePluginConfig } from '@/lib/plugin';
import { PLUGIN_NAME } from '@/lib/statics';
import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { cacheAtom } from '../states';
import { store } from '../store';

const events: kintoneAPI.js.EventType[] = ['app.record.create.submit', 'app.record.edit.submit'];

listener.add(events, async (event) => {
  const { conditions } = cleanse(restorePluginConfig());

  const targetConditions = conditions.filter(
    (c) => c.srcField && c.srcAppId && c.enablesValidation
  );

  if (!targetConditions.length) {
    return event;
  }

  for (const condition of targetConditions) {
    const { id, dstField, saveAndLookup } = condition;
    if (!event.record[dstField]?.value || saveAndLookup) {
      continue;
    }

    const atom = cacheAtom(id);
    const { valueAtStart, lookuped } = store.get(atom);

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
