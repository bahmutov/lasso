#!/usr/bin/env node

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

var page = process.argv[2];
console.assert(page, 'missing page filename');
console.log('test page', page);

// set base folder to be the page's immediate folder
// then the page itself would be just its own file name
handlers.init({
	basedir: path.dirname(path.resolve(process.cwd(), page))
});
page = path.basename(page);

var app = connect()
	.use(connect.favicon())
	.use(connect.logger('dev'))
	.use(function(req, res){
		var pathname = url.parse(req.url).pathname;
		console.log('serving', pathname);

		// todo What about json / images / other file types?
		if (htmlRegex.test(pathname)) {
			handlers.serveStaticHtml(pathname, res);
		} else if (svgRegex.test(pathname)) {
			// todo serve svg
		} else if (jsRegex.test(pathname)) {
			handlers.serveStaticJs(pathname, res);
		} else {
    	res.end('ERROR: handler not defined for ' + pathname + '\n');
    }
  });

var port = 8888;
var phantomRunnerFilename = './src/basic_runner.js';
var coverageFilename = 'coverage.json';

var regexpQuote = require('regexp-quote');
var separatorRegex = new RegExp(regexpQuote(path.sep), 'g');
var pageUrl = 'http://localhost:' + port + '/' + page.replace(separatorRegex, '/');
console.log('page url to load', pageUrl);

http.createServer(app).listen(port);
console.log('server has started');

console.log('Opening in phantomjs page', pageUrl);
console.log('output coverage filename', coverageFilename);

var spawn = require('child_process').spawn;
var phantomjs = spawn('phantomjs', [phantomRunnerFilename, pageUrl, coverageFilename]);

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

	var reportFolder = path.join(__dirname, 'cover');
	var report = Report.create('html', {
		dir: reportFolder,
		verbose: false
	});
	report.writeReport(collector, true);
	console.log('wrote html coverage reports to', reportFolder);

	Report.create('text').writeReport(collector);
	Report.create('text-summary').writeReport(collector);

  process.exit(0);
});