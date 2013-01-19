// grabs command line arguments
var path = require('path');
var optimist = require('optimist');

function options() {
	var args = optimist.usage('Page widget JS testing with code coverage on the fly.\n' + 
		'Usage: $0\n' + 
		'lasso.js <html page>')
		.default({
			help: 0,
			cover: "cover",
			colors: true,
			serve: false,
			basic: true,
			jsunity: false,
			doh: false,
			jasmine: false,
			qunit: false,
			mocha: false,
			pavlov: false,
			sinon: false,
			instrument: true,
			verbose: false,
			port: 8888,
			timeout: 3
		})
		.alias('h', 'help')
		.alias('c', 'cover').string("cover").describe("cover", "output folder with coverage")
		.boolean('colors').describe('colors', 'use terminal colors, might not work with continuous build')
		.boolean('server').describe('serve', 'start webserver, remain running, useful for manual debugging')
		.boolean('jsunity').describe('jsunity', 'filter jsUnity libraries')
		.boolean('doh').describe('doh', 'filter Dojo DOH libraries')
		.boolean('jasmine').describe('jasmine', 'filter Jasmine library js files')
		.boolean('qunit').describe('qunit', 'filter qunit library js files')
		.boolean('mocha').describe('mocha', 'filter mocha library js files')
		.boolean('pavlov').describe('pavlov', 'filter qunit and pavlov library js files')
		.boolean('sinon').describe('sinon', 'filter qunit and sinon library js files')
		.boolean('basic').describe('basic', 'use basic phantomjs runner')
		.boolean('instrument').describe('instrument', 'instrument the JS code for coverage')
		.boolean('verbose').describe('verbose', 'verbose phantomjs requests')
		.describe('port', 'port to use')
		.describe('timeout', 'phantomjs page testing wait timeout, seconds')
		.argv;

	args.lassoDir = path.dirname(process.argv[1]);
	args.page = args._[0];

	if (args.h || args.help) {
		optimist.showHelp();
		console.log(args);
		process.exit(0);
	}
	return args;
}

exports.run = options;