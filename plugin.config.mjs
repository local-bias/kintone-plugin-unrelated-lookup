//@ts-check
const HP = 'https://konomi.app/';
const commonCDN = 'https://cdn.jsdelivr.net/gh/local-bias/kintone-cdn@latest/dist/';
const localhost = 'https://127.0.0.1:32682';

/** @type {import('@konomi-app/kintone-utilities').PluginConfig} */
export default {
  manifest: {
    base: {
      manifest_version: 1,
      version: '1.10.0',
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
      desktop: {
        js: [`${localhost}/dist/dev/desktop/index.js`],
        css: [`${localhost}/dist/dev/desktop.css`],
      },
      mobile: {
        js: [`${localhost}/dist/dev/desktop/index.js`],
        css: [`${localhost}/dist/dev/desktop.css`],
      },
      config: {
        js: [`${localhost}/dist/dev/config/index.js`],
        css: [`${localhost}/dist/dev/config.css`],
      },
    },
    prod: {
      desktop: { js: ['desktop.js'], css: ['desktop.css'] },
      mobile: { js: ['desktop.js'], css: ['desktop.css'] },
      config: { js: ['config.js'], css: ['config.css'] },
    },
    standalone: {
      desktop: { js: ['desktop.js'], css: ['desktop.css'] },
      mobile: { js: ['desktop.js'], css: ['desktop.css'] },
      config: { js: ['config.js'], css: ['config.css'] },
    },
  },
};
