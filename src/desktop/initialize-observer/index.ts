import { singleTypePluginConditionsAtom } from '@/desktop/states';
import { manager } from '@/lib/event-manager';
import { store } from '@/lib/store';
import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { initializeSingleMode } from './single-mode';

const events: kintoneAPI.js.EventType[] = ['app.record.create.show', 'app.record.edit.show'];

manager.add(events, async (event) => {
  const singleTypeConditions = store.get(singleTypePluginConditionsAtom);

  for (const condition of singleTypeConditions) {
    initializeSingleMode({ record: event.record, condition });
  }

  return event;
});
