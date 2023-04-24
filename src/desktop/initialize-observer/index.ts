import { cleanseStorage, restoreStorage } from '@/common/plugin';
import { lookupObserver } from '../lookup-observer';
import { KintoneEventListener, kintoneAPI } from '@konomi-app/kintone-utilities';

const events: kintoneAPI.js.EventType[] = ['app.record.create.show', 'app.record.edit.show'];

export default (listener: KintoneEventListener) => {
  listener.add(events, async (event, { pluginId }) => {
    const { conditions } = cleanseStorage(restoreStorage(pluginId!));

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
};
