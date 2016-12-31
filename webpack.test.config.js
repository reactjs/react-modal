const commonConfig = require('./webpack.config');

commonConfig.plugins = [];
commonConfig.entry = undefined;
commonConfig.debug = true;
commonConfig.devtool = 'inline-source-map';

module.exports = commonConfig;
