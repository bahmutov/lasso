var fs = require('fs');
var path = require('path');

var config = {
	basedir: __dirname
};

function init(options) {
	options = options || {};
	config.basedir = options.basedir || config.basedir;
	console.log('basedir for handlers', config.basedir);
}

function fullPath(pathname) {
	var dir = path.join(config.basedir, path.dirname(pathname));
	var foundPath = path.join(dir, pathname);
	var prevDir;

	do {
		if (fs.existsSync(foundPath)) {
			return foundPath;
		}
		prevDir = dir;
		dir = path.normalize(path.join(dir, '..'));
		foundPath = path.join(dir, pathname);
	} while (dir !== prevDir);
	console.error('could not find', pathname, 'base dir', config.basedir);
	return null;
}

function readFileSync(pathname, encoding) {
	var filename = fullPath(pathname);
	console.assert(filename, 'could not find file from path', pathname);

	encoding = encoding || 'utf-8';
	console.log('serving file', filename, 'for path', pathname);
	var content = fs.readFileSync(filename, encoding);
	console.assert(content, 'could not read', pathname);
	return content;
}

exports.init = init;
exports.fullPath = fullPath;
exports.readFileSync = readFileSync;
