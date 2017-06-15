const browsers = [process.env.CONTINUOUS_INTEGRATION ? 'Firefox' : 'Chrome'];

module.exports = function(config) {
  config.set({

    basePath: '',

    frameworks: ['mocha'],

    files: [
      'specs/spec_index.js'
    ],

    preprocessors: {
      'specs/spec_index.js': ['webpack', 'sourcemap']
    },

    webpack: require('./webpack.test.config'),

    webpackMiddleware: {
      stats: 'errors-only'
    },

    reporters: ['mocha', 'coverage'],

    mochaReporter: {
      showDiff: true
    },

    coverageReporter: {
      type : 'lcov',
      dir : 'coverage/',
      subdir: '.'
    },

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers,

    // Increase timeouts to prevent the issue with disconnected tests (https://goo.gl/nstA69)
    captureTimeout: 4 * 60 * 1000,

    singleRun: (process.env.CONTINUOUS_INTEGRATION)
  });
};
