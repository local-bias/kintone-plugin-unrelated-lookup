import { ComponentManager } from '@konomi-app/kintone-utilities-react';
import { manager } from '@/lib/event-manager';
import { ENV } from '@/lib/global';
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

    const componentManager = ComponentManager.getInstance();
    componentManager.renderComponent({
      id: ROOT_ID,
      component: <App />,
    });

    return event;
  }
);
