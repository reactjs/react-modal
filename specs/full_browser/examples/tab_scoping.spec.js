const istanbul = require('istanbul');
const sauce = require('../../support/sauce');

function getCoverage () {
  return window.__coverage__; // eslint-disable-line no-underscore-dangle
}

let collector;
module.exports = {
  before () {
    if (process.env.CONTINUOUS_INTEGRATION || process.env.COVERAGE) {
      collector = new istanbul.Collector();
    }
  },
  beforeEach (browser) {
    browser
      .url('http://localhost:8080')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('.Example__OpenModalBtn', 2000)
      .click('.Example__OpenModalBtn')
      .assert.hasFocus('.ReactModal__Content', '.ReactModal__Content has focus');
  },
  'tabbing past the last element loops back to the first': (browser) => {
    browser.click('.Example__OpenModalBtn')
           .assert.hasFocus('.ReactModal__Content', '.ReactModal__Content has focus')
           .waitForElementVisible('.Example__Button--last', 1000)
           .click('.Example__Button--last')
           .keys(browser.Keys.TAB)
           .assert.hasFocus('.Example__CloseModalBtn');
  },
  'shift tabbing from the first element loops to the last': (browser) => {
    browser
      .waitForElementVisible('.Example__Button--last', 1000)
      .keys(browser.Keys.TAB)
      .assert.hasFocus('.Example__CloseModalBtn')
      .keys([browser.Keys.SHIFT, browser.Keys.TAB])
      .assert.hasFocus('.Example__Button--last');
  },
  afterEach (browser, done) {
    if (process.env.CONTINUOUS_INTEGRATION || process.env.COVERAGE) {
      browser.execute(getCoverage, [], (response) => {
        // if (!fs.existsSync('coverage_selenium')) {
        //   fs.mkdirSync('coverage_selenium');
        // }
        // fs.writeFileSync(`coverage_selenium/report${testCount}.json`, JSON.stringify());
        collector.add(response.value);
        done();
      });
    } else {
      done();
    }
  },
  after (browser, done) {
    browser.end();
    if (process.env.CONTINUOUS_INTEGRATION || process.env.COVERAGE) {
      const reporter = new istanbul.Reporter();
      reporter.add('lcovonly');
      reporter.write(collector, false, () => {
        console.log('Coverage report generated');
        done();
      });
    } else {
      done();
    }
  },
  tearDown: sauce
};
