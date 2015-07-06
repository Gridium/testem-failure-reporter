var PassThrough = require('stream').PassThrough;
var FailureReporter = require('./index');
var assert = require('chai').assert;

describe('test failure reporter', function() {

    it('writes out result without passes', function() {
        var stream = new PassThrough();
        var reporter = new FailureReporter(stream);
        reporter.report('phantomjs', {
            name: 'it does stuff',
            passed: true,
            logs: []
        });
        reporter.report('phantomjs', {
            name: 'it fails',
            passed: false,
            error: new Error('at host:port/path:line: it crapped out'),
            logs: ["I am a log", "Useful information"]
        });
        reporter.finish();
        var output = stream.read().toString();
        // one line per failure plus three for summary
        assert.equal(output.split('\n').length, 4);
        assert.match(output, /1\/2 failed/);
    });

    it('writes out errors', function() {
        var stream = new PassThrough();
        var reporter = new FailureReporter(stream);
        reporter.report('phantomjs', {
            name: 'it fails',
            passed: false,
            error: new Error('at host:port/path:line: it crapped out'),
            logs: ["I am a log", "Useful information"]
        });
        reporter.finish();
        var output = stream.read().toString();
        // one line per failure plus three for summary
        assert.equal(output.split('\n').length, 4);
        assert.match(output, /it crapped out/);
    });
});

