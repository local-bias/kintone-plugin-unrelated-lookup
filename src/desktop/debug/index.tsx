import { ENV } from '@/lib/global';
import { listener } from '@/lib/listener';
import { nanoid } from 'nanoid';
import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './app';
import { css } from '@emotion/css';

const ROOT_ID = nanoid();

listener.add(
  [
    'app.record.index.show',
    'app.record.detail.show',
    'app.record.create.show',
    'app.record.edit.show',
  ],
  (event) => {
    if (ENV !== 'development') {
      return event;
    }

    const rootElement = document.getElementById(ROOT_ID) ?? document.createElement('div');
    rootElement.id = ROOT_ID;
    const wrapperElement = document.querySelector('#record-gaia') ?? document.body;
    wrapperElement.classList.add(css`
      display: grid;
      grid-template-columns: 320px 1fr;
    `);
    wrapperElement.prepend(rootElement);
    const root = createRoot(rootElement);
    root.render(<App />);

    return event;
  }
);
