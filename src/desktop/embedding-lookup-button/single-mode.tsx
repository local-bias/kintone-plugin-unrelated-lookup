import { PLUGIN_NAME } from '@/lib/constants';
import { isProd } from '@/lib/global';
import { PluginCondition } from '@/schema/plugin-config';
import { css } from '@emotion/css';
import { getMetaFieldId_UNSTABLE, isMobile, kintoneAPI } from '@konomi-app/kintone-utilities';
import { ComponentManager } from '@konomi-app/kintone-utilities-react';
import App from './app';

export const embeddingSingleMode = (params: {
  condition: PluginCondition;
  record: kintoneAPI.RecordData;
}) => {
  const { condition, record } = params;

  const targetField = record[condition.dstField];
  if (!targetField) {
    console.warn(
      `[${PLUGIN_NAME}] 対象フィールド「${condition.dstField}」が存在しないため、処理を中断します。`
    );
    return;
  }

  // 対象フィールドは入力可
  //@ts-expect-error @kintone/dts-genに`disabled`がないため
  targetField.disabled = false;

  // コピーするフィールドは、プラグイン設定に従って入力可/不可を切り替える
  for (const { to, disabled } of condition.copies) {
    if (record[to]) {
      //@ts-expect-error @kintone/dts-genに`disabled`がないため
      record[to].disabled = disabled;
    }
  }

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

  const displayType =
    targetField.type === 'CHECK_BOX' || targetField.type === 'RADIO_BUTTON' ? 'block' : 'flex';

  wrapper.classList.add(css`
    display: ${isMobile() ? 'grid' : displayType};
    position: relative;
    gap: ${isMobile() ? '4px' : '0'};

    /** 標準機能のルックアップボタンを非表示 */
    .input-lookup-gaia,
    .input-clear-gaia {
      display: none;
    }
  `);

  ComponentManager.getInstance().renderComponent({
    id: `embedding-lookup-button-${condition.id}`,
    component: <App conditionId={condition.id} />,
    parentElement: wrapper,
    onRootElementReady: (element) => {
      element.classList.add(css`
        display: flex;
      `);
    },
  });
};
