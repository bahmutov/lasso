function tests() {
	console.assert(true, 'true is false');

	console.log('loading data json');
	$.getJSON('data.json', function(data) {
		console.log('got json data');
		console.assert(data.name === 'foo', 'wrong name!');
	});
}