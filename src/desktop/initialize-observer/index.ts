import { cleanse, restorePluginConfig } from '@/lib/plugin';
import { lookupObserver } from '../lookup-observer';
import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { listener } from '@/lib/listener';
import { ENV } from '@/lib/global';

const events: kintoneAPI.js.EventType[] = ['app.record.create.show', 'app.record.edit.show'];

listener.add(events, async (event) => {
  const { conditions } = cleanse(restorePluginConfig());

  const targetConditions = conditions.filter(
    (condition) => condition.srcField && condition.srcAppId
  );

  if (!targetConditions.length) {
    return event;
  }

  for (const condition of targetConditions) {
    const { id, dstField } = condition;
    if (!event.record[dstField]) {
      continue;
    }

    lookupObserver[id] = {
      fieldCode: dstField,
      valueAtStart: (event.record[condition.dstField].value as string) || '',
      lookuped: false,
    };
  }

  ENV === 'development' && console.log({ lookupObserver });

  return event;
});
