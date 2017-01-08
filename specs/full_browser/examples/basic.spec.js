module.exports = {
  beforeEach: (browser) => {
    browser
      .url('http://localhost:8080')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('.Example__OpenModalBtn', 1000);
  },
  'scopes tab navigation to the modal': (browser) => {
    browser.click('.Example__OpenModalBtn')
           .assert.hasFocus('.ReactModal__Content', '.ReactModal__Content has focus')
  },
  after: browser => browser.end(),
};
