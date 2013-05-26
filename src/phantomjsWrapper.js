var fs = require('fs');
var path = require('path');
var regexpQuote = require('regexp-quote');
var istanbul = require('istanbul');
var Report = istanbul.Report;
var spawn = require('child_process').spawn;
var _ = require('lodash');
var untested = require('untested');

function run(options) {
	options = options || {};
	// console.assert(options.lassoDir, 'missing lasso dir');
	// var lassoDir = path.dirname(module.filename);

	var runner = 'phantomjsRunner.js';
	var phantomRunnerFilename = path.join(path.dirname(module.filename), runner);
	console.assert(fs.existsSync(phantomRunnerFilename), 'could not find phantom runner', phantomRunnerFilename);

	options.coverageFilename = path.join(process.cwd(), 'cover.json');

	var separatorRegex = new RegExp(regexpQuote(path.sep), 'g');
	var pageUrl = 'http://localhost:' + options.port + '/' + options.page.replace(separatorRegex, '/');
	console.log('page url to load', pageUrl);

	console.log('Opening in phantomjs page', pageUrl);
	console.log('output coverage filename', options.coverageFilename);

	var phantomArguments = [phantomRunnerFilename, pageUrl, options.coverageFilename];
	if (options.verbose) {
		phantomArguments.push('--verbose');
	}
	if (options.timeout) {
		phantomArguments.push('--timeout');
		phantomArguments.push(options.timeout);
	}
	var phantomjs = spawn('phantomjs', phantomArguments);

	phantomjs.stdout.on('data', function (data) {
		console.log('phantomjs: ' + data);
	});

	phantomjs.stderr.on('data', function (data) {
		console.log('phantomjs error: ' + data);
	});

	phantomjs.on('exit', _.partial(processPhantomJsResults, options));
}

function processPhantomJsResults(options, code) {
	console.log('phantomjs process exited with code ' + code);
	console.assert(fs.existsSync(options.coverageFilename),
		'could not find coverage file', options.coverageFilename);

	console.log('generating detailed HTML coverage pages from', options.coverageFilename);
	var collector = new istanbul.Collector();
	collector.add(JSON.parse(fs.readFileSync(options.coverageFilename, 'utf8')));

	var reportFolder = path.join(process.cwd(), 'cover');
	var report = Report.create('html', {
		dir: reportFolder,
		verbose: false
	});
	report.writeReport(collector, true);
	console.log('wrote html coverage reports to', reportFolder);

	Report.create('text').writeReport(collector);
	Report.create('text-summary').writeReport(collector);

	Report.create('text', {
		file: 'cover.txt'
	}).writeReport(collector);
	console.log('saved coverage text report to', path.join(process.cwd(), 'cover.txt'));

	if (options.untested) {
		var coverageData = collector.getFinalCoverage();
		console.assert(coverageData, 'could not get coverage data');
		updateUntestedDb(coverageData, options);
	}

	process.exit(0);
}

function updateUntestedDb(coverageData, options)
{
	console.assert(options.basedir, 'missing basedir');
	console.assert(options.page, 'missing page address');

	var full = path.join(options.basedir, options.page);
	var coverageSummary = untested.getCoverageSummary(coverageData);
	console.assert(coverageSummary, 'could not get coverage summary from\n',
		JSON.stringify(coverageData, null, 2));
	untested.update({
		test: full,
		coverage: coverageSummary
	});
}

exports.run = run;