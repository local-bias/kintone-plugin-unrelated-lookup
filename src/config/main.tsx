import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';

const root = document.getElementById('settings');

if (!root) {
  throw new Error('フォームの描画に失敗しました');
}

createRoot(root).render(<App />);
