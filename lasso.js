#!/usr/bin/env node

var options = require('./src/options').run();

var _ = require('lodash');
var connect = require('connect');
var fs = require('fs');
var http = require('http');
var path = require('path');
var url = require('url');

var handlers = require('./src/handlers');
var routes = require('./src/routes');
var phantomjs = require('./src/phantomjsWrapper');

var istanbul = require('istanbul');

console.assert(options.page, 'missing page filename');
options.page = path.resolve(process.cwd(), options.page);
options.basedir = path.dirname(options.page);

// set base folder to be the page's immediate folder
// then the page itself would be just its own file name
handlers.init({
	basedir: options.basedir
});
options.page = path.basename(options.page);

function serveSomething(pathname, res, options) {
	var foundMapping = routes.find(pathname);
	if (!foundMapping) {
		throw new Error('handler not defined for ' + pathname);
	} else {
		console.log('matched pattern for', pathname, foundMapping.regex);
		console.assert(typeof foundMapping.handler === 'function', 
			'could not find handler function for', pathname);
		foundMapping.handler(pathname, res, options);
	}
}

var app = connect()
.use(connect.favicon())
.use(connect.logger('dev'))
.use(function(req, res){
	var pathname = url.parse(req.url).pathname;
	console.log('serving url', req.url, 'pathname', pathname);
	if (pathname === '/') {
		pathname = options.page;
	}

	serveSomething(pathname, res, options);
});

console.assert(options.port > 100, 'invalid port', options.port);
http.createServer(app).listen(options.port);
console.log('server has started at port', options.port);

if (!options.serve) {
	phantomjs.run(options);
}