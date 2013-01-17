var fs = require('fs');
var path = require('path');
var fileFinder = require('./fileFinder');
var _ = require('lodash');

var istanbul = require('istanbul');
var instrumenter = new istanbul.Instrumenter();

var config = {
	instrument: true,
	filters: [
		/jsunity-\d\.\d.js$/i, 
		/jsunity\.js$/i, 
		/jsunityLogging\.js$/i,
		/dojo1\.8\.0/i,
		/jasmine/i,
		/qunit/i,
		/mocha/i,
		/pavlov\.js$/i,
		/sinon\.js$/i
	]
};

function init(options) {
	options = options || {};
	config.instrument = options.instrument || config.instrument;
	config.filters = options.filters || config.filters;
	fileFinder.init(options);
}

function serveStaticFile(contentType, format, pathname, response) {
	console.assert(contentType, 'undefined contentType');
	console.assert(format, 'undefined format');
	console.assert(format === 'utf-8' || format === 'binary', 'wrong format', format);
	console.assert(pathname, 'undefined pathname');
	console.assert(response, 'undefined response');

	response.writeHead(200, {
		"Content-Type": contentType
	});
	response.write(fileFinder.readFileSync(pathname, format), format);
	response.end();
}

function isFilteredJs(pathname) {
	console.assert(pathname, 'undefined pathname to check');
	return config.filters.some(function (filter) {
		return filter.test(pathname);
	});
}

function serveJs(pathname, response, options) {
	options = options || {};
	response.writeHead(200, {
		"Content-Type": 'application/javascript'
	});
	var filename = fileFinder.fullPath(pathname);
	var code = fileFinder.readFileSync(pathname);

	var needInstrument = config.instrument;
	if (needInstrument) {
		if (isFilteredJs(pathname)) {
			console.log(pathname, 'should NOT be instrumented');
			needInstrument = false;
		}
	}

	if (needInstrument) {
		var instrumented = instrumenter.instrumentSync(code, filename);
		response.write(instrumented);
	} else {
		response.write(code);
	}
	response.end();
}

exports.init = init;
exports.serveStaticHtml = _.partial(serveStaticFile, 'text/html', 'utf-8');
exports.serveStaticJs = serveJs;
exports.serveStaticSvg = _.partial(serveStaticFile, 'image/svg+xml', 'utf-8');
exports.serveStaticImagePng = _.partial(serveStaticFile, 'image/png', 'binary');;
exports.serveStaticCss = _.partial(serveStaticFile, 'text/css', 'utf-8');
exports.serveStaticJson = _.partial(serveStaticFile, 'application/json', 'utf-8');