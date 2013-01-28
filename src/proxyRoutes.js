var _ = require('lodash');

var handlersMap = [];
var handlers = null;

function mapHandler(regex, fn) {
	handlersMap.push({ 
		regex: regex,
		handler: fn
	});
}

exports.run = function(h) {
	console.assert(h, 'undefined handlers');
	handlers = h;
	mapHandler(/\.js$/, handlers.serveStaticJs);
};

exports.find = function(pathname) {
	var foundMapping = _.find(handlersMap, function (mapping) {
		return mapping.regex.test(pathname);
	});

	if (!foundMapping) {
		console.log('could not find handler for', pathname, 'using forward');
		foundMapping = {
			regex: '',
			handler: handlers.forward
		};
	}
	return foundMapping;
};