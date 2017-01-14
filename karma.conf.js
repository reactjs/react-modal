const webpackTestConfig = require('./webpack.test.config');

module.exports = function karmaConfig (config) {
  let browsers = [];
  const customLaunchers = {};

  const reporters = [];

  function createCustomLauncher (browser, version, platform) {
    return {
      base: 'SauceLabs',
      browserName: browser,
      version,
      platform
    };
  }

  if (process.env.SAUCE_USERNAME || process.env.SAUCE_ACCESS_KEY) {
    const OPTIONS = [
      'SAUCE_CHROME',
      'SAUCE_FIREFOX',
      'SAUCE_SAFARI',
      'SAUCE_IE',
      'SAUCE_EDGE',
    ];

    let runAll = true;

    OPTIONS.forEach((opt) => {
      if (process.env[opt]) {
        runAll = false;
      }
    });

    // Chrome
    if (runAll || process.env.SAUCE_CHROME) {
      customLaunchers.SL_Chrome = createCustomLauncher('chrome');
    }

    // Firefox
    if (runAll || process.env.SAUCE_FIREFOX) {
      customLaunchers.SL_Firefox = createCustomLauncher('firefox');
    }

    // Safari
    if (runAll || process.env.SAUCE_SAFARI) {
      customLaunchers.SL_Safari10 = createCustomLauncher('safari', 10);
      customLaunchers.SL_Safari9 = createCustomLauncher('safari', 9);
    }

    // IE
    if (runAll || process.env.SAUCE_IE) {
      customLaunchers.SL_IE11 = createCustomLauncher('internet explorer', 11, 'Windows 10');
    }

    // Edge
    if (runAll || process.env.SAUCE_EDGE) {
      customLaunchers.SL_Edge = createCustomLauncher('microsoftedge', null, 'Windows 10');
    }

    browsers = Object.keys(customLaunchers);
    reporters.push('saucelabs');
  } else {
    browsers = [(process.env.CONTINUOUS_INTEGRATION) ? 'Firefox' : 'Chrome'];
  }

  config.set({

    basePath: '',

    frameworks: ['mocha'],

    files: [
      'specs/js/spec_index.js'
    ],

    preprocessors: {
      'specs/js/spec_index.js': ['webpack', 'sourcemap']
    },

    webpack: webpackTestConfig,

    webpackMiddleware: {
      stats: 'errors-only'
    },

    reporters: ['mocha', 'coverage'].concat(reporters),

    mochaReporter: {
      showDiff: true
    },

    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/',
      subdir: '.'
    },

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers,
    customLaunchers,

    // Increase timeouts to prevent the issue with disconnected tests (https://goo.gl/nstA69)
    captureTimeout: 4 * 60 * 1000,
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 1,
    browserNoActivityTimeout: 4 * 60 * 1000,

    singleRun: (process.env.CONTINUOUS_INTEGRATION),

    // SauceLabs config
    sauceLabs: {
      startConnect: (!process.env.CONTINUOUS_INTEGRATION),
      recordScreenshots: false,
      connectOptions: {
        port: 5757,
        logfile: 'sauce_connect.log'
      },
      public: 'public'
    }
  });
};
