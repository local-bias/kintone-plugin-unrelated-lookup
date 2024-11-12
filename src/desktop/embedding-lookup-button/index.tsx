import { manager } from '@/lib/event-manager';
import { store } from '@/lib/store';
import { css } from '@emotion/css';
import { getMetaFieldId_UNSTABLE, kintoneAPI } from '@konomi-app/kintone-utilities';
import { createRoot } from 'react-dom/client';
import { pluginConfigAtom } from '../states';
import App from './app';

const events: kintoneAPI.js.EventType[] = ['app.record.create.show', 'app.record.edit.show'];

const getElementId = (conditionId: string) => `embedding-lookup-button-${conditionId}`;

manager.add(events, async (event) => {
  const { conditions } = store.get(pluginConfigAtom);

  for (const condition of conditions) {
    if (!condition.dstField || !condition.srcAppId || !condition.srcField) {
      continue;
    }

    // コピーするフィールドは入力不可
    for (const { to } of condition.copies) {
      //@ts-ignore
      if (event.record[to]?.disabled) {
        //@ts-ignore
        event.record[to].disabled = true;
      }
    }

    // 対象フィールドは入力可
    //@ts-ignore
    event.record[condition.dstField].disabled = false;

    // 対象文字列フィールドにルックアップっぽいボタンを設置
    const fieldId = getMetaFieldId_UNSTABLE(condition.dstField);

    const wrapper =
      document.querySelector<HTMLDivElement>(`.value-${fieldId} > div`) ||
      document.querySelector<HTMLDivElement>(`.value-${fieldId}`);

    if (!wrapper) {
      return event;
    }

    let element = document.getElementById(getElementId(condition.id));
    if (!element) {
      wrapper.classList.remove('disabled-cybozu');

      wrapper.classList.add(css`
        display: flex;
      `);

      element = document.createElement('div');
      element.id = `embedding-lookup-button-${condition.id}`;
      wrapper.append(element);
      element.classList.add(css`
        display: flex;
        position: relative;
      `);
    }

    createRoot(element).render(<App conditionId={condition.id} />);
  }

  return event;
});
