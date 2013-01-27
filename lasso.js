#!/usr/bin/env node

var _ = require('lodash');
var connect = require('connect');
var fs = require('fs');
var http = require('http');
var path = require('path');
var url = require('url');

var options = require('./src/options');

var handlers = require('./src/handlers');
var routes = require('./src/routes');
routes.run(handlers);

var phantomjs = require('./src/phantomjsWrapper');
var istanbul = require('istanbul');

/**
	minimum options when running from another module

	var lasso = require('lasso');
	lasso.run({
		page: 'path/to/html/file'
	});
*/
function run(options) {
	console.assert(options, 'missing options');
	console.assert(options.page, 'missing page filename');
	if (/^http\:\/\//.test(options.page)) {
		console.log('serving as proxy for page', options.page);
		options.basedir = path.dirname(options.page);
		console.assert(/\.html$/.test(options.page), 
			'missing html document name in url', options.page);
	} else {
		options.page = path.resolve(process.cwd(), options.page);
		options.basedir = path.dirname(options.page);
		options.page = path.basename(options.page);
	}
	options.timeout = options.timout || 3;
	options.port = options.port || 8888;

	// set base folder to be the page's immediate folder
	// then the page itself would be just its own file name
	handlers.init({
		basedir: options.basedir
	});
	
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
	.use(function(req, res) {
		var pathname = url.parse(req.url).pathname;
		console.log('serving url', req.url, 'pathname', pathname);
		if (pathname === '/') {
			console.log('default pathname matches page', options.page);
			pathname = options.page;
		}

		serveSomething(pathname, res, options);
	});

	console.assert(options.port > 100, 'invalid port', options.port);
	http.createServer(app).listen(options.port);
	console.log('server has started at port', options.port);

	console.log('target page', options.page);
	if (!/^http/.test(options.page)) {
		if (module.parent || !options.serve) {
			phantomjs.run(options);
		}
	}
}

if (!module.parent) {
	run(options.run());
}

exports.run = run;