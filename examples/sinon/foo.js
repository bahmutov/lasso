function once(fn) {
	var returnValue, called = false;
	return function () {
		if (!called) {
			called = true;
			returnValue = fn.apply(this, arguments);
		}
		return returnValue;
	};
}

function foo() {
	return 'foo';
}

function notCalled() {
	return 'this function is not called';
}