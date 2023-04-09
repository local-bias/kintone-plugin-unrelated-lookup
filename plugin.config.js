/** @type {import('./src/types/plugin-config').PluginConfig} */
module.exports = {
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
      homepage_url: {
        ja: 'https://konomi.app/',
        en: 'https://konomi.app/',
      },
      desktop: {
        js: ['https://cdn.jsdelivr.net/gh/local-bias/kintone-cdn@latest/dist/desktop.js'],
        css: [],
      },
      mobile: {
        js: ['https://cdn.jsdelivr.net/gh/local-bias/kintone-cdn@latest/dist/desktop.js'],
        css: [],
      },
      config: {
        html: 'config.html',
        js: ['https://cdn.jsdelivr.net/gh/local-bias/kintone-cdn@latest/dist/config.js'],
        css: [],
        required_params: [],
      },
    },
    dev: {
      desktop: { js: ['desktop.js'] },
      mobile: { js: ['desktop.js'] },
      config: { js: ['config.js'] },
    },
    prod: {
      desktop: {
        js: [
          'https://cdn.jsdelivr.net/gh/local-bias/kintone-plugin-unrelated-lookup@latest/cdn/desktop.js',
        ],
      },
      mobile: {
        js: [
          'https://cdn.jsdelivr.net/gh/local-bias/kintone-plugin-unrelated-lookup@latest/cdn/desktop.js',
        ],
      },
      config: {
        js: [
          'https://cdn.jsdelivr.net/gh/local-bias/kintone-plugin-unrelated-lookup@latest/cdn/config.js',
        ],
      },
    },
  },
};
