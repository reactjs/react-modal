const path = require('path');

let browsers = ['ChromeHeadless'];
let coverageType = 'text';

if (process.env.CONTINUOUS_INTEGRATION) {
  browsers = ['Firefox'];
  coverageType = 'lcovonly';
}

module.exports = function(config) {
  config.set({
    browsers,

    frameworks: ['mocha', 'webpack'],

    plugins: [
      'karma-webpack',
      'karma-mocha',
      'karma-coverage',
      'karma-sourcemap-loader',
      'karma-chrome-launcher',
      'karma-mocha-reporter',
    ],

    preprocessors: {
      './src/*.js': ['coverage'],
      './src/**/*.js': ['coverage'],
      './specs/index.js': ['webpack', 'sourcemap']
    },

    files: ['./specs/index.js'],

    webpack: require('./scripts/webpack.test.config'),

    reporters: ['mocha', 'coverage'],

    mochaReporter: { showDiff: true },

    coverageReporter: {
      // specify a common output directory
      dir: './coverage',
      reporters: [
	{ type: 'html', subdir: 'html' },
	{ type: 'lcov', subdir: 'lcov' }
      ]
    },

    logLevel: config.LOG_INFO,

    autoWatch: true,

    port: 9876,

    // Increase timeouts to prevent the issue
    // with disconnected tests (https://goo.gl/nstA69)
    captureTimeout: 4 * 60 * 1000,

    singleRun: (process.env.CONTINUOUS_INTEGRATION)
  });
};
