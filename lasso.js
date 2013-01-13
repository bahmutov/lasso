var connect = require('connect');
var fs = require('fs');
var http = require('http');
var path = require('path');
var url = require('url');
var handlers = require('./handlers');

var istanbul = require('istanbul');
var Report = istanbul.Report;

var htmlRegex = /\.html$/;
var jsRegex = /\.js$/;

var app = connect()
	.use(connect.favicon())
	.use(connect.logger('dev'))
	.use(function(req, res){
		var pathname = url.parse(req.url).pathname;
		if (htmlRegex.test(pathname)) {
			handlers.serveStaticHtml(pathname, res);
		} else if (jsRegex.test(pathname)) {
			handlers.serveStaticJs(pathname, res);
		} else {
    	res.end('Hello from Connect!\n');
    }
  });

var port = 8888;
var phantomRunnerFilename = 'simple_runner.js';
var coverageFilename = 'coverage.json';

http.createServer(app).listen(port);
console.log('server has started');

var spawn = require('child_process').spawn;
var phantomjs = spawn('phantomjs', [phantomRunnerFilename, 'http://localhost:' + port + '/start.html', coverageFilename]);

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