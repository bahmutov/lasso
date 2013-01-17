QUnit.module("foo tests");

QUnit.test("foo test", function () {
	QUnit.equal(typeof foo, 'function', 'foo is a function');
	QUnit.equal(foo(), 'foo', 'foo returns string foo');
});

QUnit.test("spy exists", function () {
	QUnit.ok(sinon, 'sinon exists');
	QUnit.equal(typeof sinon.spy, 'function', 'sinon.spy exists');
});

QUnit.test("calls the original function", function () {
	QUnit.equal(typeof once, 'function', 'once is a function');
    var callback = sinon.spy();
    var proxy = once(callback);

    proxy();
    QUnit.ok(callback.called, 'called the function');
    QUnit.equal(callback.callCount, 1, 'single time call');

    proxy();
    proxy();
    QUnit.equal(callback.callCount, 1, 'still single time');
});

QUnit.test("returns the return value from the original function", function () {
    var callback = sinon.stub().returns(42);
    var proxy = once(callback);

    QUnit.equal(proxy(), 42, 'returns correct answer');
});