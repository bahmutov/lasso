/* global phantom */
/* global __coverage__ */
var system = require('system');
var fs = require('fs');
var options = require('./phantomjsArguments').run(system.args);
console.log('options', JSON.stringify(options));

options.timeout = options.timeout || 3; // seconds

var done = false;

function waitFor(onReady, timeOutSeconds) {
    var maxtimeOutMillis = timeOutSeconds ? timeOutSeconds * 1000 : 3001, //< Default Max Timout is 3s
        start = new Date().getTime(),
        interval = setInterval(function () {
            if (done || (new Date().getTime() - start > maxtimeOutMillis)) {
                // Condition fulfilled (timeout and/or condition is 'true')
                console.log('"waitFor()" finished in ' + (new Date().getTime() - start) + 'ms.');
                //< Do what it's supposed to do once the condition is fulfilled
                if (typeof(onReady) === 'string') {
                    /* jshint -W061 */
                    eval(onReady);
                } else {
                    onReady();
                }
                clearInterval(interval); //< Stop this interval
            }
        }, 25); //< repeat check every N ms
}

if (system.args.length < 3) {
    console.log('Usage: simple_runner.js URL outputCoverageFilename.json');
    phantom.exit(1);
}

var page = require('webpage').create();
var verbose = ((system.args.length > 3) && (system.args[3] === '--verbose'));

if (verbose) {
    // monitoring requests
    page.onResourceRequested = function (request) {
        console.log('phantomjs request ' + JSON.stringify(request, undefined, 2));
    };
    page.onResourceReceived = function (response) {
        console.log('phantomjs receive ' + JSON.stringify(response, undefined, 2));
    };
}

// Route 'console.log()' calls from within the Page context to the main Phantom context (i.e. current 'this')
page.onConsoleMessage = function (msg) {
    console.log(msg);
};

page.onInitialized = function () {
    console.log('page.onInitialized');
    var testReporting = 'testReporting.js';
    var injected = page.injectJs(testReporting);
    console.assert(injected, 'could not inject into page', testReporting);
};

page.onCallback = function (data) {
    console.assert(data, 'null data from page');
    console.log('TEST RESULTS: ' + data);
    done = true;
};

page.open(system.args[1], function (status) {
    if (status !== 'success') {
        console.log('Unable to access network');
        phantom.exit(1);
    } else {

        waitFor(function () {
            var coverage = page.evaluate(function () {
                return __coverage__;
            });
            console.assert(coverage, 'could not get js code coverage object');
            // console.log('js code coverage data', JSON.stringify(coverage));
            var filename = system.args[2];
            fs.write(filename, JSON.stringify(coverage), 'w');
            console.log('wrote coverage to', filename);
            phantom.exit(0);
        }, options.timeout);
    }
});
