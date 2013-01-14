var fs = require('fs');
var path = require('path');

var istanbul = require('istanbul');
var instrumenter = new istanbul.Instrumenter();

var basedir = __dirname;
function init(options) {
	options = options || {};
	basedir = options.basedir || __dirname;

	console.log('basedir for handlers', basedir);
}


function fullPath(pathname) {
	var dir = basedir;
	var name = path.basename(pathname);
	var foundPath = path.join(dir, name);
	do {
		if (fs.existsSync(foundPath)) {
			return foundPath;
		}
		var prevDir = dir;
		dir = path.normalize(path.join(dir, '..'));
		foundPath = path.join(dir, name);
	} while (dir !== prevDir);
	console.error('could not find', pathname);
	return null;
}

function readFileSync(pathname) {
	var filename = fullPath(pathname);
	console.log('serving file', filename, 'for path', pathname);
	var content = fs.readFileSync(filename, 'utf-8');
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

function isJsUnityFile(pathname) {
	if (/jsunity-\d\.\d.js$/i.test(pathname)) {
		console.log(pathname, 'is jsunity file');
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
	if (options.jsunity && isJsUnityFile(pathname)) {
		response.write(code);
	} else {
		var instrumented = instrumenter.instrumentSync(code, filename);
		response.write(instrumented);
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