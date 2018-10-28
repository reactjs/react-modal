/* global require, process, module */

let browsers = ['ChromeHeadless'];
let coverageType = 'text';

if (process.env.CONTINUOUS_INTEGRATION) {
  browsers = ['Firefox'];
  coverageType = 'lcovonly';
}

// NOTE:
// Increase `captureTimeout: number` to prevent the issue
// with disconnected tests (https://goo.gl/nstA69).

module.exports = function(config) {
  config.set({
    frameworks: ['mocha'],
    preprocessors: {
      './src/*.js': ['coverage'],
      './src/**/*.js': ['coverage'],
      './specs/index.js': ['webpack', 'sourcemap']
    },
    files: ['./specs/index.js'],
    webpack: require('./webpack.test.config'),
    webpackMiddleware: { stats: 'errors-only' },
    reporters: ['mocha', 'coverage'],
    mochaReporter: { showDiff: true },
    coverageReporter: {
      type : coverageType,
      dir : 'coverage/',
      subdir: '.'
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers,
    captureTimeout: 4 * 60 * 1000,
    singleRun: process.env.CONTINUOUS_INTEGRATION
  });
};
