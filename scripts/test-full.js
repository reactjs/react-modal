/* eslint-env shelljs */
require('shelljs/global');

let exitCode = 0;

echo('############################### LINTING ###############################');
exitCode += exec('npm run lint').code;

echo('############################## JS SPECS ###############################');
exitCode += exec('npm test -- --single-run').code;

if (process.env.SELENIUM) {
  echo('########################### SELENIUM SPECS ############################');
  echo('-> Starting examples');
  const server = exec('npm run test:examples:run', { async: true });
  echo('-> Running Nightwatch');
  const testRunner = exec('npm run test:examples -- --env ie11,edge,chrome,firefox,safari', { async: true });

  testRunner.on('exit', (code) => {
    exitCode += code;
    server.kill();

    echo('########################## MERGING COVERAGE ###########################');
    exitCode += exec('./node_modules/.bin/lcov-result-merger "coverage/*.info" "coverage/combined_lcov.info"');

    exit(exitCode);
  });
} else {
  mv('coverage/lcov.info', 'coverage/combined_lcov.info');
  exit(exitCode);
}
