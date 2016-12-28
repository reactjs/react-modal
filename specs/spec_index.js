const testsContext = require.context('.', true, /spec$/);
testsContext.keys().forEach(function(path) {
    try {
        testsContext(path);
    } catch(err) {
      debugger
      console.error(`[ERROR] WITH SPEC FILE: ${path}`);
      console.error(err);
    }
});
