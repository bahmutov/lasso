define(['demo/foo'], function (foo) {
	console.assert(typeof foo === 'function', 'foo is a function');
	console.assert(foo() === 'foo', 'incorrect return value');

	QUnit.module('testing foo');
	QUnit.test('foo', function () {
		QUnit.equal(typeof foo, 'function', 'foo is a function');
		QUnit.equal(foo(), 'foo', 'foo returns correct result');
	});

	QUnit.test('call counter', function () {
		var o = {
			foo: function() {
				return 'something';
			}
		};

		sinon.spy(o, 'foo');
		QUnit.equal(o.foo(), 'something', 'returned correct value');
    QUnit.ok(o.foo.calledOnce, 'foo was called once');

    QUnit.equal(o.foo(), 'something', 'called second time');
    QUnit.equal(o.foo.callCount, 2, 'called two times');
    o.foo.restore();
  });
});