//@ts-check
const HP = 'https://konomi.app/';
const commonCDN = 'https://cdn.jsdelivr.net/gh/local-bias/kintone-cdn@latest/dist/';
const cdn = 'https://cdn.jsdelivr.net/gh/local-bias/kintone-plugin-unrelated-lookup@latest/cdn/';
const localhost = 'https://127.0.0.1:5500/dist/dev/';

/** @type {import('./src/types/plugin-config').PluginConfig} */
export default {
  manifest: {
    base: {
      manifest_version: 1,
      version: '1.9.0',
      type: 'APP',
      name: {
        en: 'unrelated lookup plugin',
        ja: '関連付けないルックアッププラグイン',
        zh: '插件模板',
      },
      description: {
        en: 'implements lookup that removes only lookup-associated functions, which can cause collective renewal or collective collection.Use a single line field.',
        ja: '一括更新や一括取込の障害となってしまうことのある、ルックアップの関連付け機能のみを取り除いたルックアップを実装するプラグインです。文字列１行フィールドを使用します。',
        zh: '插件模板',
      },
      icon: 'icon.png',
      homepage_url: { ja: HP, en: HP },
      desktop: { js: [`${commonCDN}desktop.js`], css: [] },
      mobile: { js: [`${commonCDN}desktop.js`], css: [] },
      config: { html: 'config.html', js: [`${commonCDN}config.js`], css: [], required_params: [] },
    },
    dev: {
      desktop: { js: [`${localhost}desktop/index.js`] },
      mobile: { js: [`${localhost}desktop/index.js`] },
      config: { js: [`${localhost}config/index.js`] },
    },
    prod: {
      desktop: { js: [`${cdn}desktop.js`] },
      mobile: { js: [`${cdn}desktop.js`] },
      config: { js: [`${cdn}config.js`] },
    },
  },
};
