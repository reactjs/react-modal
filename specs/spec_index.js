const testsContext = require.context('.', true, /spec$/);
testsContext.keys().forEach((path) => {
  try {
    testsContext(path);
  } catch (err) {
    console.error(`[ERROR] WITH SPEC FILE: ${path}`);
    console.error(err);
  }
});
