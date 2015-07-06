var FailureReporter = require('./index');
var reporter = new FailureReporter();

module.exports = {
    "launch_in_ci": [ "CI" ],
    "launchers": {
        "CI": {
            "command": "mocha --timeout 3000 test.js",
        }
    },
    "reporter": reporter
};
