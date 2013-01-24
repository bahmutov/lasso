var handlers = require('./handlers');
var _ = require('lodash');

var handlersMap = [
{ 
	regex: /\.html$/,
	handler: handlers.serveStaticHtml
},
{ 
	regex: /\.htm$/,
	handler: handlers.serveStaticHtml
},
{
	regex: /\.svg$/,
	handler: handlers.serveStaticSvg
},
{ 
	regex: /\.js$/, 
	handler: handlers.serveStaticJs
},
{ 
	regex: /\.png$/, 
	handler: handlers.serveStaticImagePng
},
{
	regex: /\.css$/,
	handler: handlers.serveStaticCss
},
{
	regex: /\.json$/,
	handler: handlers.serveStaticJson
}];

exports.find = function(pathname) {
	var foundMapping = _.find(handlersMap, function (mapping) {
		return mapping.regex.test(pathname);
	});
	return foundMapping;
};