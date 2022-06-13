import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './app';

const main = (pluginId: string): void => {
  const root = document.getElementById('settings');

  if (!root) {
    throw new Error('フォームの描画に失敗しました');
  }

  createRoot(root).render(<App {...{ pluginId }} />);
};

export default main;
