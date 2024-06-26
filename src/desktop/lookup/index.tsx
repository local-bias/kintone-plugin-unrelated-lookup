import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';

const ROOT_ID = `🐸lookup-root`;

let rootElement: HTMLElement | null = document.getElementById(ROOT_ID);
if (!rootElement) {
  rootElement = document.createElement('div');
  rootElement.id = ROOT_ID;
  document.body.append(rootElement);
}

const root = createRoot(rootElement);

root.render(<App />);
