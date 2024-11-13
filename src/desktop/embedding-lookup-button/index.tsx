import { manager } from '@/lib/event-manager';
import { store } from '@/lib/store';
import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { pluginConfigAtom } from '../states';
import { embeddingSingleMode } from './single-mode';

const events: kintoneAPI.js.EventType[] = ['app.record.create.show', 'app.record.edit.show'];

manager.add(events, async (event) => {
  const { conditions } = store.get(pluginConfigAtom);

  for (const condition of conditions) {
    embeddingSingleMode({ condition, record: event.record });
  }

  return event;
});
