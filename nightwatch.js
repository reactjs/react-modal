const TRAVIS_JOB_NUMBER = process.env.TRAVIS_JOB_NUMBER || '';

module.exports = {
  src_folders: ['specs/full_browser/'],
  output_folder: 'specs/full_browser/reports',
  custom_assertions_path: 'specs/support/assertions/',

  test_settings: {
    default: {
      launch_url: 'http://ondemand.saucelabs.com:80',
      selenium_port: 80,
      selenium_host: 'ondemand.saucelabs.com',
      silent: true,
      username: process.env.SAUCE_USERNAME,
      access_key: process.env.SAUCE_ACCESS_KEY,
      screenshots: {
        enabled: false,
        path: '',
      },
      globals: {
        waitForConditionTimeout: 10000,
      },
      build: `build-${TRAVIS_JOB_NUMBER}`,
      'tunnel-identifier': TRAVIS_JOB_NUMBER,
    },

    local: {
      launch_url: 'http://localhost',
      selenium_port: 4444,
      selenium_host: 'localhost',
      silent: true,
      desiredCapabilities: {
        browserName: 'chrome'
      }
    },

    ie11: {
      desiredCapabilities: {
        browserName: 'internet explorer',
        platform: 'Windows 10',
        version: '11.0',
      }
    },

    edge: {
      desiredCapabilities: {
        browserName: 'microsoftedge',
        platform: 'Windows 10',
      }
    },

    chrome: {
      browserName: 'chrome'
    },

    firefox: {
      browserName: 'firefox'
    },

    safari: {
      browserName: 'safari'
    }
  }
};
