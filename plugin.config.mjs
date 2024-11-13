// @ts-check
const hp = 'https://konomi.app';
const cdn = 'https://kintone-plugin.konomi.app';
const key = 'unrelated-lookup';

/** @satisfies { Plugin.Meta.Config } */
export default /** @type { const } */ ({
  id: `ribbit-kintone-plugin-${key}`,
  pluginReleasePageUrl: `https://ribbit.konomi.app/kintone-plugin/`,
  server: {
    port: 32682,
  },
  lint: {
    build: false,
  },
  tailwind: {
    css: 'src/styles/global.css',
    config: {
      desktop: 'tailwind.config.desktop.mjs',
      config: 'tailwind.config.config.mjs',
    },
  },
  manifest: {
    base: {
      manifest_version: 1,
      version: '1.13.1',
      type: 'APP',
      name: {
        en: 'Unrelated Lookup Plugin',
        ja: '関連付けないルックアッププラグイン',
        zh: '无关查找插件',
      },
      description: {
        en: 'This plugin uses a single-line text field instead of a lookup field to achieve data linkage between apps that cannot be realized with standard functions.',
        ja: 'ルックアップフィールドの代わりに文字列1行フィールドを使用し、標準機能では実現できないアプリ間のデータ連携を実現します。エラーの発生しにくいアプリづくりをサポートします。',
        zh: '该插件使用单行文本字段代替查找字段，以实现标准功能无法实现的应用程序之间的数据联动。它支持创建不易出错的应用程序。',
      },
      icon: 'icon.png',
      homepage_url: { ja: hp, en: hp, zh: hp },
      desktop: { js: [`${cdn}/common/desktop.js`], css: [`${cdn}/common/desktop.css`] },
      mobile: { js: [`${cdn}/common/desktop.js`], css: [`${cdn}/common/desktop.css`] },
      config: {
        html: 'config.html',
        js: [`${cdn}/common/config.js`],
        css: [`${cdn}/common/config.css`],
        required_params: [],
      },
    },
    prod: {
      desktop: { js: [`${cdn}/${key}/desktop.js`], css: [`${cdn}/${key}/desktop.css`] },
      mobile: { js: [`${cdn}/${key}/desktop.js`], css: [`${cdn}/${key}/desktop.css`] },
      config: { js: [`${cdn}/${key}/config.js`], css: [`${cdn}/${key}/config.css`] },
    },
    standalone: {
      desktop: { js: ['desktop.js'], css: ['desktop.css'] },
      mobile: { js: ['desktop.js'], css: ['desktop.css'] },
      config: { js: ['config.js'], css: ['config.css'] },
    },
  },
});
