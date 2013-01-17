#!/usr/bin/env node

var options = require('./src/options').run();

var connect = require('connect');
var fs = require('fs');
var http = require('http');
var path = require('path');
var url = require('url');

var handlers = require('./src/handlers');

var istanbul = require('istanbul');
var Report = istanbul.Report;

var htmlRegex = /\.html$/;
var jsRegex = /\.js$/;
var svgRegex = /\.svg$/;
var imagePngRegex = /\.png$/;
var cssRegex = /\.css$/;
var jsonRegex = /\.json$/;

console.assert(options.page, 'missing page filename');
console.log('test page', options.page);

// set base folder to be the page's immediate folder
// then the page itself would be just its own file name
handlers.init({
	basedir: path.dirname(path.resolve(process.cwd(), options.page))
});
options.page = path.basename(options.page);

var app = connect()
	.use(connect.favicon())
	.use(connect.logger('dev'))
	.use(function(req, res){
		var pathname = url.parse(req.url).pathname;
		console.log('serving url', req.url, 'pathname', pathname);
		if (pathname === '/') {
			pathname = 'index.html';
		}

		// todo What about json / images / other file types?
		if (htmlRegex.test(pathname)) {
			handlers.serveStaticHtml(pathname, res);
		} else if (svgRegex.test(pathname)) {
			handlers.serveStaticSvg(pathname, res);
		} else if (jsRegex.test(pathname)) {
			handlers.serveStaticJs(pathname, res, options);
		} else if (imagePngRegex.test(pathname)) {
			handlers.serveStaticImagePng(pathname, res);
		} else if (cssRegex.test(pathname)) {
			handlers.serveStaticCss(pathname, res);
		} else if (jsonRegex.test(pathname)) {
			handlers.serveStaticJson(pathname, res);
		} else {
    	res.end('ERROR: handler not defined for ' + pathname + '\n');
    }
  });

console.assert(options.port > 100, 'invalid port', options.port);
http.createServer(app).listen(options.port);
console.log('server has started at port', options.port);

if (!options.serve) {
	console.assert(options.lassoDir, 'missing lasso dir');
	var runner;
	if (options.basic) {
		runner = 'basic_runner.js';
	} else if (options.jsunity) {
		runner = 'basic_runner.js'; // todo: replace with custom, grab test results?
	} else if (options.doh) {
		runner = 'basic_runner.js'; // todo: replace with custom, grab test results?
	}
	var phantomRunnerFilename = path.join(options.lassoDir, 'src', runner);
	console.assert(fs.existsSync(phantomRunnerFilename), 'could not find phantom runner', phantomRunnerFilename);

	var coverageFilename = path.join(process.cwd(), 'cover.json');

	var regexpQuote = require('regexp-quote');
	var separatorRegex = new RegExp(regexpQuote(path.sep), 'g');
	var pageUrl = 'http://localhost:' + options.port + '/' + options.page.replace(separatorRegex, '/');
	console.log('page url to load', pageUrl);

	console.log('Opening in phantomjs page', pageUrl);
	console.log('output coverage filename', coverageFilename);

	var spawn = require('child_process').spawn;
	var phantomArguments = [phantomRunnerFilename, pageUrl, coverageFilename];
	if (options.verbose) {
		phantomArguments.push('--verbose');
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

	  process.exit(0);
	});
}