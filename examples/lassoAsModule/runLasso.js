var path = require('path');
var lasso = require('../../lasso');

var html = path.resolve('../basic/foo.html');
console.log('running lasso on', html);

lasso.run({
	page: html,
	lassoDir: path.resolve('../..'),
	timeout: 3
});


