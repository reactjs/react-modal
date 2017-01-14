// Adapted from https://gist.github.com/mikberg/ce463e09d6adf46f987c
/* eslint no-console:0 */
const https = require('https');

module.exports = function sauce (callback) {
  const currentTest = this.client.currentTest;
  const username = this.client.options.username;
  const sessionId = this.client.capabilities['webdriver.remote.sessionid'];
  const accessKey = this.client.options.accessKey;

  if (!this.client.launch_url.match(/saucelabs/)) {
    console.log('Not saucelabs ...');
    return callback();
  }

  if (!username || !accessKey || !sessionId) {
    console.log(this.client);
    console.log('No username, accessKey or sessionId');
    return callback();
  }

  const passed = currentTest.results.passed === currentTest.results.tests;

  const data = JSON.stringify({
    passed,
  });

  const requestPath = `/rest/v1/${username}/jobs/${sessionId}`;

  function responseCallback (res) {
    res.setEncoding('utf8');
    console.log('Response: ', res.statusCode, JSON.stringify(res.headers));
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      console.info('Finished updating saucelabs');
      callback();
    });
  }

  try {
    console.log('Updating saucelabs', requestPath);

    const req = https.request({
      hostname: 'saucelabs.com',
      path: requestPath,
      method: 'PUT',
      auth: `${username}:${accessKey}`,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    }, responseCallback);

    req.on('error', (e) => {
      console.log(`problem with request: ${e.message}`);
    });
    req.write(data);
    return req.end();
  } catch (error) {
    console.log('Error', error);
    return callback();
  }
};
