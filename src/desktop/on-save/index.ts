import { manager } from '@/lib/event-manager';
import { PluginCondition } from '@/lib/plugin';
import { store } from '@/lib/store';
import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { singleTypePluginConditionsAtom } from '../states';
import { singleModeOnSave } from './single-mode';

const events: kintoneAPI.js.EventType[] = ['app.record.create.submit', 'app.record.edit.submit'];

manager.add(events, async (event) => {
  const filter = (c: PluginCondition) => c.saveAndLookup;
  const singleTypeConditions = store.get(singleTypePluginConditionsAtom).filter(filter);

  for (const condition of singleTypeConditions) {
    await singleModeOnSave({ event, condition });
  }

  return event;
});
