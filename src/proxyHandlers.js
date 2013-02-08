var fs = require('fs');
var http = require('http');
var path = require('path');
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
	],
	basedir: null
};

function init(options) {
	options = options || {};
	config.instrument = options.instrument || config.instrument;
	config.filters = options.filters || config.filters;
	config.basedir = options.basedir;
	console.assert(config.basedir, 'missing basedir');
}

function forward(pathname, response) {
	var serverPath = pathname;
	if (!/^http/.test(pathname)) {
		serverPath = config.basedir + pathname;
	}
	console.log('forwarding request', pathname, 'to', serverPath);
	http.get(serverPath, function(res) {
		response.writeHead(res.statusCode, {
			"Content-Type": res.contentType
		});
		res.setEncoding('utf8');
		res.on('data', function (data) {
			response.write(data);
		})
		res.on('end', function () {
			response.end();
		});
	});
}

// todo: merge with handlers.js
function isFilteredJs(pathname) {
	console.assert(pathname, 'undefined pathname to check');
	return _(config.filters).invoke('test', pathname).some();
}

function serveJs(pathname, response) {
	var serverPath = pathname;
	if (!/^http/.test(pathname)) {
		serverPath = config.basedir + pathname;
	}
	console.log('forwarding request', pathname, 'to', serverPath);
	var code = '';
	http.get(serverPath, function(res) {
		response.writeHead(res.statusCode, {
			"Content-Type": res.contentType
		});
		res.setEncoding('utf8');
		res.on('data', function (data) {
			code += data;
		})
		res.on('end', function () {
			var needInstrument = config.instrument;
			if (needInstrument) {
				if (isFilteredJs(pathname)) {
					console.log(pathname, 'should NOT be instrumented');
					needInstrument = false;
				}
			}

			if (needInstrument) {
				var instrumented = instrumenter.instrumentSync(code, serverPath);
				response.end(instrumented);
			} else {
				response.end(code);
			}			
		});
	});
}

exports.init = init;
exports.forward = forward;
exports.serveStaticJs = serveJs;
