import { ComponentManager } from '@/lib/component-manager';
import { manager } from '@/lib/event-manager';
import { ENV } from '@/lib/global';
import { css } from '@emotion/css';
import { nanoid } from 'nanoid';
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

    document.body.classList.add(css`
      transform: scale(0.8) translateX(-12.5%) translateY(-12.5%);
      height: 125dvh;
    `);

    const componentManager = ComponentManager.getInstance();
    componentManager.renderComponent({
      elementId: ROOT_ID,
      component: <App />,
    });

    return event;
  }
);
