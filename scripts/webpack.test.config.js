const path = require('path');
const defaultConfig = require('./defaultConfig');

delete defaultConfig['output'];

module.exports = {
  ...defaultConfig,
  plugins: [],
  devtool: 'inline-source-map',
  module: {
    ...defaultConfig.module,
    rules: defaultConfig.module.rules
  }
};
