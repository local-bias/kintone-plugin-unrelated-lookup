import { manager } from '@/lib/event-manager';
import { ENV } from '@/lib/global';
import { css } from '@emotion/css';
import { nanoid } from 'nanoid';
import { createRoot } from 'react-dom/client';
import App from './app';

const ROOT_ID = nanoid();

manager.add(
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
    const wrapperElement = document.body;
    wrapperElement.classList.add(css`
      transform: scale(0.8) translateX(-12.5%) translateY(-12.5%);
      height: 125dvh;
    `);
    wrapperElement.prepend(rootElement);
    const root = createRoot(rootElement);
    root.render(<App />);

    return event;
  }
);
