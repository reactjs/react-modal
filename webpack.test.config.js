const path = require('path');
const commonConfig = require('./webpack.config');


commonConfig.plugins = [];
if (!process.env.SELENIUM) {
  commonConfig.entry = undefined;
}
commonConfig.debug = true;
commonConfig.devtool = 'inline-source-map';

if (process.env.CONTINUOUS_INTEGRATION || process.env.COVERAGE) {
  commonConfig.module.postLoaders = commonConfig.module.postLoaders || [];
  commonConfig.module.postLoaders.push({
    test: /\.js$/,
    include: path.resolve('lib'),
    loader: 'istanbul-instrumenter'
  });
}

module.exports = commonConfig;
