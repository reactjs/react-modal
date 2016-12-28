module.exports = function(config) {
  config.set({

    basePath: '',

    frameworks: ['mocha'],

    files: [
      'specs/spec_index.js'
    ],

    preprocessors: {
      'specs/spec_index.js': [ 'webpack', 'sourcemap' ]
    },

    webpack: require('./webpack.test.config'),

    webpackMiddleware: {
      stats: 'errors-only'
    },

    reporters: ['mocha'],

    mochaReporter: {
      showDiff: true
    },

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: [ (process.env.CONTINUOUS_INTEGRATION) ? 'Firefox' : 'Chrome' ],

    captureTimeout: 60000,

    singleRun: (process.env.CONTINUOUS_INTEGRATION)
  });
};
