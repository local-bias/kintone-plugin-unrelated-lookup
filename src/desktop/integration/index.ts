import { PLUGIN_ID } from '@/lib/global';
import { store } from '@/lib/store';
import { getCurrentRecord } from '@konomi-app/kintone-utilities';
import { embeddingSingleMode } from '../embedding-lookup-button/single-mode';
import { onFieldChange as onSingleModeFieldChange } from '../on-field-change/single-mode';
import { singleTypePluginConditionsAtom } from '../states';

declare global {
  interface WindowOrWorkerGlobalScope {
    __ribbit?: {
      [key: string]: any; // または必要な具体的なプロパティ型
    };
  }
}

const global = self.__ribbit || (self.__ribbit = {});

global[PLUGIN_ID] = global[PLUGIN_ID] || {
  onFieldChange: () => {
    const singleModeCondition = store.get(singleTypePluginConditionsAtom);
    const current = getCurrentRecord();
    if (!current?.record) {
      console.error(`[${PLUGIN_ID}] current record is not found`);
      return;
    }

    for (const condition of singleModeCondition) {
      onSingleModeFieldChange({ condition, record: current.record });
    }

    console.log(`[${PLUGIN_ID}] ✨ Field change event is registered`);
  },
  refresh: () => {
    const singleTypeConditions = store.get(singleTypePluginConditionsAtom);
    const current = getCurrentRecord();
    if (!current?.record) {
      console.error(`[${PLUGIN_ID}] current record is not found`);
      return;
    }

    for (const condition of singleTypeConditions) {
      embeddingSingleMode({ condition, record: current.record });
    }

    console.log(`[${PLUGIN_ID}] ✨ Refreshed`);
  },
};

self.__ribbit = global;

export {};
