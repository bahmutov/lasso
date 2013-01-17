var fs = require('fs');
var path = require('path');

var istanbul = require('istanbul');
var instrumenter = new istanbul.Instrumenter();

var config = {
	basedir: __dirname,
	instrument: true
};

function init(options) {
	options = options || {};
	config.basedir = options.basedir || config.basedir;
	config.instrument = options.instrument || config.instrument;

	console.log('basedir for handlers', config.basedir);
}

function fullPath(pathname) {
	var dir = path.join(config.basedir, path.dirname(pathname));
	var foundPath = path.join(dir, pathname);
	// console.log('looking for', pathname, 'basedir', basedir);
	do {
		// console.log('testing path', foundPath);
		if (fs.existsSync(foundPath)) {
			return foundPath;
		}
		var prevDir = dir;
		dir = path.normalize(path.join(dir, '..'));
		foundPath = path.join(dir, pathname);
	} while (dir !== prevDir);
	console.error('could not find', pathname, 'base dir', config.basedir);
	return null;
}

function readFileSync(pathname, encoding) {
	encoding = encoding || 'utf-8';
	var filename = fullPath(pathname);
	console.log('serving file', filename, 'for path', pathname);
	var content = fs.readFileSync(filename, encoding);
	console.assert(content, 'could not read', pathname);
	return content;
}

function serveStaticHtml(pathname, response) {
	response.writeHead(200, {
		"Content-Type": 'text/html'
	});
	response.write(readFileSync(pathname));
	response.end();
}

function serveStaticCss(pathname, response) {
	response.writeHead(200, {
		"Content-Type": 'text/css'
	});
	response.write(readFileSync(pathname));
	response.end();
}

function serveStaticJson(pathname, response) {
	response.writeHead(200, {
		"Content-Type": 'application/json'
	});
	response.write(readFileSync(pathname));
	response.end();
}

function serveStaticSvg(pathname, response) {
	response.writeHead(200, {
		"Content-Type": 'image/svg+xml'
	});
	response.write(readFileSync(pathname));
	response.end();
}

function serveStaticImagePng(pathname, response) {
	response.writeHead(200, {
		"Content-Type": 'image/png'
	});
	response.write(readFileSync(pathname, 'binary'), 'binary');
	response.end();
}

function isJsUnityFile(pathname) {
	if (/jsunity-\d\.\d.js$/i.test(pathname) || 
		/jsunity\.js$/i.test(pathname) ||
		/jsunityLogging\.js$/i.test(pathname)) {
		console.log(pathname, 'is jsunity file');
		return true;
	}
	return false;
}

function isJsDojoFile(pathname) {
	if (/dojo1\.8\.0/i.test(pathname)) {
		console.log(pathname, 'is dojo file');
		return true;
	}
	return false;
}

function isJsJasmineFile(pathname) {
	if (/jasmine/i.test(pathname)) {
		console.log(pathname, 'is jasmine file');
		return true;
	}
	return false;
}

function isJsQUnitFile(pathname) {
	if (/qunit/i.test(pathname)) {
		console.log(pathname, 'is qunit file');
		return true;
	}
	return false;
}

function isMochaFile(pathname) {
	if (/mocha/i.test(pathname)) {
		console.log(pathname, 'is mocha file');
		return true;
	}
	return false;
}

function isPavlovFile(pathname) {
	if (/pavlov\.js$/i.test(pathname)) {
		console.log(pathname, 'is pavlov file');
		return true;
	}
	return false;
}

function isSinonFile(pathname) {
	if (/sinon\.js$/i.test(pathname)) {
		console.log(pathname, 'is sinon file');
		return true;
	}
	return false;
}

function serveStaticJs(pathname, response, options) {
	options = options || {};
	response.writeHead(200, {
		"Content-Type": 'application/javascript'
	});
	var filename = fullPath(pathname);
	var code = readFileSync(pathname);

	var needInstrument = config.instrument;
	if (needInstrument) {
		if (options.jsunity && isJsUnityFile(pathname)) {
			needInstrument = false;
		}
		if (options.doh && isJsDojoFile(pathname)) {
			needInstrument = false;
		}
		if (options.jasmine && isJsJasmineFile(pathname)) {
			needInstrument = false;
		}
		if (options.qunit && isJsQUnitFile(pathname)) {
			needInstrument = false;
		}
		if (options.mocha && isMochaFile(pathname)) {
			needInstrument = false;
		}
		if (options.pavlov && (isPavlovFile(pathname) || isJsQUnitFile(pathname))) {
			needInstrument = false;
		}
		if (options.sinon && (isSinonFile(pathname) || isJsQUnitFile(pathname))) {
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

function notFound(response) {
	console.log('404 handler');
	response.writeHead(404, {
		"Content-Type": 'text/plain'
	});
	response.write("Sorry, not found");
	response.end();
}

exports.init = init;
exports.serveStaticHtml = serveStaticHtml;
exports.serveStaticJs = serveStaticJs;
exports.serveStaticSvg = serveStaticSvg;
exports.serveStaticImagePng = serveStaticImagePng;
exports.serveStaticCss = serveStaticCss;
exports.serveStaticJson = serveStaticJson;