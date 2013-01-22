function installUnitTestHook() {
	if (typeof QUnit !== 'undefined') {
		console.log('injecting QUnit test collection');

		QUnit.done(function (info) {
			console.assert(info, 'undefined QUnit info');
			// console.log(info.passed + '/' + info.total + ' unit tests passed in ' + info.runtime + ' ms');
			var status = info.passed + '/' + info.total + ' unit tests passed in ' + info.runtime + ' ms';
			reportTestResults(status);
		});
	} else {
		console.log('Could not determine unit testing framework used on the page');
	}
}

function reportTestResults(results) {
	if (typeof window.callPhantom === 'function') {
		window.callPhantom(results);
	} else {
		console.log(results);
	}
}

document.addEventListener('DOMContentLoaded', installUnitTestHook, false);