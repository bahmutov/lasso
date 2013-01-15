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
			instrument: true
		})
		.alias('h', 'help')
		.alias('c', 'cover').string("cover").describe("cover", "output folder with coverage")
		.boolean('colors')
		.describe('colors', 'use terminal colors for output, might not work with continuous build servers')
		.boolean('server').describe('serve', 'start webserver, remain running, useful for manual debugging')
		.boolean('jsunity').describe('jsunity', 'unit tests follow jsunity rules')
		.boolean('doh').describe('doh', 'unit tests follow Dojo DOH syntax (including define)')
		.boolean('basic').describe('basic', 'use basic phantomjs runner')
		.boolean('instrument').describe('instrument', 'instrument the JS code for coverage')
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