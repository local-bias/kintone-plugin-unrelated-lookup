//@ts-check
import common from './tailwind.config.common.mjs';

/** @type { import('tailwindcss').Config } */
export default {
  ...common,
  corePlugins: {
    preflight: false,
  },
  content: ['./src/desktop/**/*.{ts,js,jsx,tsx}'],
};
