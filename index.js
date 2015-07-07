var colors = require('colors/safe');

function FailureReporter(out) {
    this.out = out || process.stdout;
    this.total = 0;
    this.fail = 0;
    this.pass = 0;  // used by ci/index.js getExitCode
}

FailureReporter.prototype = {
    report: function(prefix, data) {
        this.display(prefix, data);
        this.total++;
        if (!data.passed) {
            this.fail++;
        } else {
            this.pass++;
        }
    },
    display: function(prefix, result) {
        if (result.passed) {
            return;
        }
        this.out.write(colors.red.bold(result.name.trim())+': ');
        // result.error.message is the whole stack trace
        var lines = result.error.message.split('\n');
        var last = lines[lines.length-1].split(': ');
        // at http://localhost:7357/assets/test-support.js:5463: No model was found for 'user'
        // line number and file aren't useful because it's the concatenated file
        if (last.length > 1) {
            this.out.write(last[1]+'\n');
        } else {
            this.out.write(lines[lines.length-1]+'\n');
        }
    },
    finish: function() {
        var summary = '\n'+this.fail+'/'+this.total+' failed\n';
        if (this.fail === 0) {
            this.out.write(colors.green.bold(summary));
        } else {
            this.out.write(colors.red.bold(summary));
        }
    }
};

module.exports = FailureReporter;
