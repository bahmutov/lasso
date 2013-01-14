define([], function () {
	function notCalled() {
		return 'this is never called';
	}

	return function () {
		console.log('returning foo');
		return 'foo';
	};
});