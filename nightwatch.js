module.exports = {
  src_folders: ['specs/full_browser/'],
  output_folder: ['specs/full_browser/reports'],
  custom_assertions_path: 'specs/support/',

  test_settings: {
    default: {
      launch_url: 'http://localhost',
      selenium_port: 4444,
      selenium_host: 'localhost',
      silent: true,
      desiredCapabilities: {
        browserName: 'chrome'
      }
    }
  }
};
