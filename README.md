# Testem Failure Reporter

Report just the interesting part of a test run: the failures.

## Installation

    npm install testem-failure-reporter

## Usage

Create a `testem.js` config file that sets reporter to `testem-failure-reporter`:

````
var FailureReporter = require('testem-failure-reporter');
var reporter = new FailureReporter();

module.exports = {
  "framework": "qunit",
  "test_page": "tests/index.html?hidepassed&coverage",
  "disable_watching": true,
  "launch_in_ci": [
    "PhantomJS"
  ],
  "reporter": reporter
};
````

Run tests in an Ember CLI project on every file change, reporting only failures:

    ember test --config-file ~/work/project/testem.js

or retest on change and output coverage diff:

    node_modules/testem-failure-reporter/bin/run-tests.js

## Notes

This currently doesn't work with `ember test --module some-module` because Ember CLI 
rewrites the `testem.json` file to accomplish this, and doesn't support the
`testem.js` file.  

See [Ember CLI config rewriting](https://github.com/ember-cli/ember-cli/blob/f4844e674d35a3651693954fc9baf0dbb03cc22f/lib/commands/test.js#L51)
and [testem.js parsing](https://github.com/airportyh/testem/blob/aa6e9767ca81ae031095779c733882ba42184f42/lib/config.js#L86).
