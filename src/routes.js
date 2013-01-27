var _ = require('lodash');

var handlersMap = [];

function mapHandler(regex, fn) {
	handlersMap.push({ 
		regex: regex,
		handler: fn
	});
}

exports.run = function(handlers) {
	console.assert(handlers, 'undefined handlers');
	
	mapHandler(/\.html$/, handlers.serveStaticHtml);
	mapHandler(/\.htm$/, handlers.serveStaticHtml);
	mapHandler(/\.svg$/, handlers.serveStaticSvg);
	mapHandler(/\.js$/, handlers.serveStaticJs);
	mapHandler(/\.png$/, handlers.serveStaticImagePng);
	mapHandler(/\.css$/, handlers.serveStaticCss);
	mapHandler(/\.json$/, handlers.serveStaticJson);
};

exports.find = function(pathname) {
	var foundMapping = _.find(handlersMap, function (mapping) {
		return mapping.regex.test(pathname);
	});
	return foundMapping;
};