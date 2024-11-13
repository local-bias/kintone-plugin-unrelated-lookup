import { ComponentManager } from '@/lib/component-manager';
import { isProd } from '@/lib/global';
import { css } from '@emotion/css';
import { getMetaFieldId_UNSTABLE, kintoneAPI } from '@konomi-app/kintone-utilities';
import App from './app';

export const embeddingSingleMode = (params: {
  condition: Plugin.Condition;
  record: kintoneAPI.RecordData;
}) => {
  const { condition, record } = params;
  if (!condition.dstField || !condition.srcAppId || !condition.srcField) {
    !isProd && console.warn('Invalid condition', condition);
    return;
  }

  // コピーするフィールドは入力不可
  for (const { to } of condition.copies) {
    //@ts-ignore
    if (record[to]?.disabled) {
      //@ts-ignore
      record[to].disabled = true;
    }
  }

  // 対象フィールドは入力可
  //@ts-ignore
  record[condition.dstField].disabled = false;

  // 対象文字列フィールドにルックアップっぽいボタンを設置
  const fieldId = getMetaFieldId_UNSTABLE(condition.dstField);

  const wrapper =
    document.querySelector<HTMLDivElement>(`.value-${fieldId} > div`) ||
    document.querySelector<HTMLDivElement>(`.value-${fieldId}`);

  if (!wrapper) {
    !isProd && console.error('Wrapper not found', condition);
    return;
  }

  wrapper.classList.remove('disabled-cybozu');

  wrapper.classList.add(css`
    display: flex;
  `);

  const componentManager = ComponentManager.getInstance();
  componentManager.debug = !isProd;

  componentManager.renderComponent({
    elementId: `embedding-lookup-button-${condition.id}`,
    component: <App conditionId={condition.id} />,
    parentElement: wrapper,
    onRootElementReady: (element) => {
      element.classList.add(css`
        display: flex;
        position: relative;
      `);
    },
  });
};
