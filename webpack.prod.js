const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const KintonePlugin = require('@kintone/webpack-plugin-kintone-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',

  output: {
    path: path.resolve(__dirname, 'cdn'),
    filename: '[name].js',
  },

  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new KintonePlugin({
      manifestJSONPath: './plugin/manifest.json',
      privateKeyPath: './dist/private.ppk',
      pluginZipPath: './dist/plugin-prod.zip',
    }),
  ],

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          format: { comments: false },
          compress: { drop_console: true },
        },
      }),
    ],
  },
});
