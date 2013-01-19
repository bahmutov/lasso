function run(commandLine) {
	console.assert(commandLine, 'expect arguments');
	console.assert(Array.isArray(commandLine), 'expect array of command line arguments');

	var result = {};
	var k;
	for (k = 0; k < commandLine.length; k += 1) {
		var arg = commandLine[k];
		if (/^--/.test(arg)) {
			arg = arg.replace(/^--/, '');
			//console.log('option', arg, 'k=', k, 'of', commandLine.length);

			if (k >= commandLine.length - 1) {
				//console.log('setting option', arg, 'to true');
				result[arg] = true;
			} else if (/^--/.test(commandLine[k + 1])) {
				result[arg] = true;
			} else {
				result[arg] = commandLine[k + 1];
				if (result[arg] === 'false') {
					result[arg] = false;
				}
				k += 1;
			}
		}
	}

	return result;
}

if (module && module.exports) {
	// console.log('module =', module);
	module.exports.run = run;
}