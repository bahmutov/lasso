TestSuite.tests.push({
	name: 'sanity checks',
	fn: function() {
		jsUnity.assertions.assertEqual(typeof foo, 'object');
		jsUnity.assertions.assertEqual(typeof foo.get, 'function');
	}
});

TestSuite.tests.push({
	name: 'foo result',
	fn: function() {
		var result = foo.get();
  	jsUnity.assertions.assertEqual(result, 'foo');
  }
});

TestSuite.tests.push({
	name: 'calling non existing method',
	fn: function () {
		jsUnity.assertions.assertException(function() {
  		foo.set();
  	});
  }
});

function notCalled() {
	return 'this method is not called!';
}