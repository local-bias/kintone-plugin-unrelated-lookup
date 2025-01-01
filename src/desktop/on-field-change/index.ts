import { manager } from '@/lib/event-manager';
import { store } from '@/lib/store';
import { singleTypePluginConditionsAtom } from '../states';
import { onFieldChange } from './single-mode';

const singleTypeConditions = store.get(singleTypePluginConditionsAtom);

for (const condition of singleTypeConditions) {
  manager.addChangeEvents(
    [
      `app.record.create.change.${condition.dstField}`,
      `app.record.edit.change.${condition.dstField}`,
    ],
    (event) => {
      onFieldChange({ condition, record: event.record });
      return event;
    }
  );
}
