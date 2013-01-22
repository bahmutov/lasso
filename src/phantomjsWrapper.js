var fs = require('fs');
var path = require('path');
var regexpQuote = require('regexp-quote');
var istanbul = require('istanbul');
var Report = istanbul.Report;
var spawn = require('child_process').spawn;

function run(options) {
	options = options || {};
	console.assert(options.lassoDir, 'missing lasso dir');
	
	var runner = 'phantomjsRunner.js';
	var phantomRunnerFilename = path.join(options.lassoDir, 'src', runner);
	console.assert(fs.existsSync(phantomRunnerFilename), 'could not find phantom runner', phantomRunnerFilename);

	var coverageFilename = path.join(process.cwd(), 'cover.json');

	var separatorRegex = new RegExp(regexpQuote(path.sep), 'g');
	var pageUrl = 'http://localhost:' + options.port + '/' + options.page.replace(separatorRegex, '/');
	console.log('page url to load', pageUrl);

	console.log('Opening in phantomjs page', pageUrl);
	console.log('output coverage filename', coverageFilename);

	var phantomArguments = [phantomRunnerFilename, pageUrl, coverageFilename];
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
		console.log('phantomjs: ' + data);
	});

	phantomjs.on('exit', function (code) {
		console.log('phantomjs process exited with code ' + code);
		console.assert(fs.existsSync(coverageFilename), 'could not find coverage file', coverageFilename);

		console.log('generating detailed HTML coverage pages from', coverageFilename);
		var collector = new istanbul.Collector();
		collector.add(JSON.parse(fs.readFileSync(coverageFilename, 'utf8')));

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
			var full = path.join(options.basedir, options.page);
	  		var untested = require('untested');

	  		var coverageData = collector.getFinalCoverage();
	  		var coverageSummary = untested.getCoverageSummary(coverageData);
	  		console.assert(coverageSummary, 'could not get coverage summary from\n', 
	  			JSON.stringify(coverageData, null, 2));
	  		untested.update({
	  			test: full, 
	  			coverage: coverageSummary
	  		});
	  	}

		process.exit(0);
	});
}

exports.run = run;