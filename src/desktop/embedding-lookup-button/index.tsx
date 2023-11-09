import React from 'react';
import { createRoot } from 'react-dom/client';
import { css } from '@emotion/css';

import { restorePluginConfig } from '@/common/plugin';
import { getFieldId } from '@/common/cybozu';

import App from './app';
import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { listener } from '@/common/listener';
import { GUEST_SPACE_ID } from '@/common/global';

const events: kintoneAPI.js.EventType[] = ['app.record.create.show', 'app.record.edit.show'];

listener.add(events, async (event) => {
  const { conditions } = restorePluginConfig();

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
    const fieldId = getFieldId(condition.dstField);

    const wrapper =
      document.querySelector<HTMLDivElement>(`.value-${fieldId} > div`) ||
      document.querySelector<HTMLDivElement>(`.value-${fieldId}`);

    if (!wrapper) {
      return event;
    }

    wrapper.classList.remove('disabled-cybozu');

    wrapper.classList.add(css`
      display: flex;
    `);

    const div = document.createElement('div');
    wrapper.append(div);
    div.classList.add(css`
      display: flex;
      position: relative;
    `);

    createRoot(div).render(<App {...{ condition, guestSpaceId: GUEST_SPACE_ID ?? null }} />);
  }

  return event;
});
