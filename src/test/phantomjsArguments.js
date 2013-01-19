QUnit.module('phantomjs argumens');

QUnit.test('arguments exist', function () {
	QUnit.equal(typeof run, 'function', 'run is a function');
	QUnit.equal(run.length, 1, 'run expects single argument');
});

QUnit.test('returns an object', function () {
	var o = run([]);
	QUnit.equal(typeof o, 'object', 'returns an object');
});

QUnit.test('boolean true argument', function () {
	var o = run(['--foo']);
	QUnit.ok(o.foo, 'boolean foo argument set to true');

	o = run(['--foo', '--bar']);
	QUnit.ok(o.foo, 'boolean foo argument set to true');
	QUnit.ok(o.bar, 'boolean bar argument set to true');
});

QUnit.test('boolean value set to false', function () {
	var o = run(['--foo', 'false']);
	QUnit.equal(o.foo, false, 'false value foo');
});

QUnit.test('string value', function () {
	var o = run(['--foo', 'bar']);
	QUnit.equal(o.foo, 'bar', 'foo argument set to bar');
	QUnit.ok(!o.bar, 'no bar argument');
});

QUnit.test('number value', function () {
	var o = run(['--port', 444]);
	QUnit.equal(o.port, 444, 'port value is correct');
});

QUnit.test('few values', function () {
	var o = run(['--foo', '--bar', '--some', 4, '--alpha']);
	QUnit.ok(o.foo, 'foo is correct');
	QUnit.ok(o.bar, 'bar is correct');
	QUnit.ok(o.alpha, 'alpha is correct');
	QUnit.equal(o.some, 4, 'numberical option some is 4');
});

QUnit.test('numerical 1 means true', function () {
	var o = run(['--foo', 1]);
	QUnit.ok(o.foo, 'foo is true');
});

QUnit.test('numerical 0 means true', function () {
	var o = run(['--foo', 0]);
	QUnit.ok(!o.foo, 'foo is false');
});

QUnit.test('string argument', function () {
	var o = run(['--foo', 'a string argument']);
	QUnit.equal(o.foo, 'a string argument', 'correct string');
});