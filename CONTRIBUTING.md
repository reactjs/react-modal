### Commit Subjects

Patches will be only accepted if they have a corresponding issue
on GitHub.

Having a corresponding issue is better to track
and discuss ideas and propose changes.

### Docs

Please update the README with any API changes, the code and docs should
always be in sync.

### Development

- `npm start` runs the dev server to run/develop examples
- `npm test` will run the tests.
- `scripts/test` same as `npm test` but keeps karma running and watches
  for changes

## Miscellaneous

if you faced the below issue, make sure you use node version < 18
```node:internal/crypto/hash:71
  this[kHandle] = new _Hash(algorithm, xofLen);
                  ^

Error: error:0308010C:digital envelope routines::unsupported
    at new Hash (node:internal/crypto/hash:71:19)
    at Object.createHash (node:crypto:133:10)```