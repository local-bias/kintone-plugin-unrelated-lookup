import { manager } from '@/lib/event-manager';
import { store } from '@/lib/store';
import { currentKintoneEventTypeAtom } from '../states';

manager.add(
  [
    'app.record.create.show',
    'app.record.edit.show',
    'app.record.detail.show',
    'app.record.index.show',
  ],
  (event) => {
    store.set(currentKintoneEventTypeAtom, event.type);
    return event;
  }
);
