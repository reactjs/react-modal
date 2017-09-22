const path = require('path');
const commonConfig = require('./webpack.config');

commonConfig.plugins = [];
commonConfig.entry = './specs/index.js';
commonConfig.devtool = 'inline-source-map';

commonConfig.module.rules.unshift({
  test: /\.js$/,
  use: { loader: 'istanbul-instrumenter-loader' },
  enforce: 'post',
  include: path.resolve(__dirname, './src')
});

module.exports = commonConfig;
