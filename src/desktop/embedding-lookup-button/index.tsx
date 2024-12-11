import { manager } from '@/lib/event-manager';
import { store } from '@/lib/store';
import { singleTypePluginConditionsAtom } from '../states';
import { embeddingSingleMode } from './single-mode';
import { ComponentManager } from '@konomi-app/kintone-utilities-react';
import { isProd } from '@/lib/global';

ComponentManager.getInstance().debug = !isProd;

const singleTypeConditions = store.get(singleTypePluginConditionsAtom);

for (const condition of singleTypeConditions) {
  manager.addChangeEvents(['app.record.create.show', 'app.record.edit.show'], (event) => {
    embeddingSingleMode({ condition, record: event.record });
    return event;
  });
}
