function useFoo() {
	console.assert(typeof foo === 'function', 'foo should be a function');
	console.assert(foo() === 'foo', 'foo returns what is expected');
}