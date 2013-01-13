lasso
=====

JavaScript widget and page unit testing with on the fly instrumentation

installation
------------

	npm install -g lasso-node

Install phantomjs (version 1.8 or higher is recommended), it should be in the path.

30 second example
-----------------

1. Open examples\basic\foo.html in a browser. It should load foo.js, fooTests.js but report no coverage.
2. From command line run lasso on foo.html

	lasso foo.html

Lasso starts a local webserver, starts phantomjs, runs the foo.html through the phantomjs.
When phantomjs is asking for a .js file, lasso loads the js, instruments using *istanbul* and serves the instrumented version. Thus javascript code coverage is computed absolutely transparently to the testing code. After phantomjs is done, it saved the coverage object into a json file. Node then creates several reports: console and html. The html reports are very detailed, please take a look at them inside folder **cover**.

Contact
-------
Please contact me, Gleb Bahmutov at gleb.bahmutov@gmail.com with any comments, questions or suggestions.

License
-------
MIT licese, see included file. You can do pretty much anything except claim code ownership or sue me if there are problems ;)
