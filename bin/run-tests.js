#!/usr/bin/env node

var sane = require('sane'),
    fs = require('fs'),
    jsondiffpatch = require('jsondiffpatch'),
    spawn = require('child_process').spawn,
    colors = require('colors/safe');

var jsonDiff = jsondiffpatch.create();

/*
    watch for changes to dist/assets/project.js
    run tests on change
    get blanket.js coverage output and log changes
 */

function getCoverage() {
    var coverage = { 
            percentage: 0,
            files: {}
        };
    try {
        var data = JSON.parse(fs.readFileSync('coverage.json', 'utf-8'));
        coverage.percentage = data.coverage.total.percentage;
        data.coverage.files.forEach(function(file) {
            coverage.files[file.name] = file.percentage;
        });
    } catch(err) {
    }
    return coverage;
}

function retest() {
    var preCoverage = getCoverage();
    var config = process.cwd()+'/testem.js';
    var child = spawn('ember', ['test', '--config-file', config], {stdio: 'inherit'});
    child.on('close', function(code) { 
        var postCoverage = getCoverage();
        var delta = jsonDiff.diff(preCoverage.files, postCoverage.files);
        if (delta) {
            jsondiffpatch.console.log(delta);
        }
        var pctDiff = postCoverage.percentage - preCoverage.percentage;
        pctDiff = Math.round(pctDiff*10)/10;
        if (pctDiff > 0) {
            pctDiff = colors.green('+'+pctDiff+'%');
        } else if (pctDiff < 0) {
            pctDiff = colors.red(pctDiff)+'%';
        }
        console.log('coverage change: '+pctDiff);
    });
}

var path = process.cwd().split('/');
var project = path[path.length-1];
var watcher = sane(process.cwd()+'/dist/assets', {glob: [project+'.js']});

watcher.on('ready', function() { 
    console.log('watching '+project);
});
watcher.on('change', function(filepath, root, stat) { 
    retest();
});
watcher.on('add', function(filepath, root, stat) { 
    retest();
});
