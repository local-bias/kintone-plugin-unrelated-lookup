import { cleanse, restorePluginConfig } from '@/lib/plugin';
import { lookupObserver } from '../lookup-observer';
import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { listener } from '@/lib/listener';

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
    if (!event.record[condition.dstField]) {
      continue;
    }

    lookupObserver[condition.dstField] = {
      atStart: (event.record[condition.dstField].value as string) || '',
      lookuped: false,
    };
  }

  if (process?.env?.NODE_ENV === 'development') {
    console.log({ lookupObserver });
  }

  return event;
});
