const testsContext = require.context('.', true, /spec$/);
testsContext.keys().forEach((path) => {
  try {
    testsContext(path);
  } catch (err) {
    console.error(`[ERROR] WITH SPEC FILE: ${path}`);
    console.error(err);
  }
});

const componentsContext = require.context('../lib', true, /\.js$/);
componentsContext.keys().forEach((path) => {
  try {
    componentsContext(path);
  } catch (err) {
    console.error(`[ERROR] WITH LIB FILE: ${path}`);
    console.error(err);
  }
});
