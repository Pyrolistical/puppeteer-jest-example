# puppeteer-jest-example

This is an example of setting up puppeteer, then calling jest smoothly.

Adapted from [jest-puppeteer-example](https://github.com/xfumihiro/jest-puppeteer-example)

## Features
 * reduce coupling with Jest API
 * remove usage of global when creating browser (but kept global in test)
 * generate jest environment code instead of passing around puppeteer ws endpoint
 * graceful cleanup on CTRL+C

```
$ npm test

> @ test .../puppeteer-jest-example
> node index.js

PASS __tests__/test1.js
PASS __tests__/test4.js
PASS __tests__/test5.js
PASS __tests__/test2.js
PASS __tests__/test3.js

Test Suites: 5 passed, 5 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        4.514s
Ran all test suites.
```

> Please file an issue or send [@pyrolistical](https://twitter.com/pyroistical) a Tweet if you have any questions.
