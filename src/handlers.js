var fs = require('fs');
var path = require('path');

var istanbul = require('istanbul');
var instrumenter = new istanbul.Instrumenter();

function fullPath(pathname) {
	return path.join(__dirname, pathname);
}

function readFileSync(pathname) {
	var content = fs.readFileSync(fullPath(pathname), 'utf-8');
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

function serveStaticJs(pathname, response) {
	response.writeHead(200, {
		"Content-Type": 'application/javascript'
	});
	var filename = fullPath(pathname);
	var code = readFileSync(pathname);
	var instrumented = instrumenter.instrumentSync(code, filename);
	response.write(instrumented);
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

exports.serveStaticHtml = serveStaticHtml;
exports.serveStaticJs = serveStaticJs;