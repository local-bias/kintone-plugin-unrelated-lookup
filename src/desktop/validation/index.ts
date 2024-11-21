import { manager } from '@/lib/event-manager';
import { PluginCondition } from '@/lib/plugin';
import { store } from '@/lib/store';
import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { singleTypePluginConditionsAtom } from '../states';
import { validateSingleMode } from './single-mode';

const events: kintoneAPI.js.EventType[] = ['app.record.create.submit', 'app.record.edit.submit'];

manager.add(events, async (event) => {
  const filter = (c: PluginCondition) => c.enablesValidation && !c.saveAndLookup;
  const singleTypeConditions = store.get(singleTypePluginConditionsAtom).filter(filter);

  for (const condition of singleTypeConditions) {
    validateSingleMode({ record: event.record, condition });
  }

  return event;
});
