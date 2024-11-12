import { ENV } from '@/lib/global';
import { PLUGIN_NAME } from '@/lib/constants';
import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { cacheAtom, pluginConfigAtom } from '../states';
import { store } from '@/lib/store';
import { manager } from '@/lib/event-manager';

const events: kintoneAPI.js.EventType[] = ['app.record.create.submit', 'app.record.edit.submit'];

manager.add(events, async (event) => {
  const { conditions } = store.get(pluginConfigAtom);

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
