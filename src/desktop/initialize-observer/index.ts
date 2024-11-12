import { pluginConfigAtom, setCachedValue } from '@/desktop/states';
import { manager } from '@/lib/event-manager';
import { store } from '@/lib/store';
import { kintoneAPI } from '@konomi-app/kintone-utilities';

const events: kintoneAPI.js.EventType[] = ['app.record.create.show', 'app.record.edit.show'];

manager.add(events, async (event) => {
  const { conditions } = store.get(pluginConfigAtom);

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

    setCachedValue(id, {
      fieldCode: dstField,
      valueAtStart: (event.record[dstField].value as string) || '',
      lookuped: false,
    });
  }

  return event;
});
