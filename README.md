lasso
=====

JavaScript widget and page unit testing with on the fly instrumentation

[![NPM info][nodei.co]](https://npmjs.org/package/lasso)

![Build status][ci-image]

[![dependencies][dependencies-image]][dependencies-url]
[![endorse][endorse-image]][endorse-url]

installation
------------

	npm install -g lasso-node

Install phantomjs (version 1.8 or higher is recommended), it should be in the path.

30 second example
-----------------

1. Open examples\basic\foo.html in a browser. It should load foo.js, fooTests.js but report no coverage.
2. From command line run lasso on foo.html

	lasso-node foo.html

Lasso starts a local webserver, starts phantomjs, runs the foo.html through the phantomjs.
When phantomjs is asking for a .js file, lasso loads the js, instruments using *istanbul* and serves the instrumented version. Thus javascript code coverage is computed absolutely transparently to the testing code. After phantomjs is done, it saved the coverage object into a json file. Node then creates several reports: console and html. The html reports are very detailed, please take a look at them inside folder **cover**.


Options
-------

Use -h or --help command line switch to see all available options

Main ones:

+ --jsunity - filters a few jsunity library js files to avoid instrumenting 3rd party tools
+ --serve - start the webserver and wait, you can then open http://localhost:8888/foo.html in any browser to see what phantomjs is running.

Contact
-------
Please contact me, Gleb Bahmutov at gleb.bahmutov@gmail.com with any comments, questions or suggestions.

License
-------

MIT license, see included file. You can do pretty much anything except claim code ownership or sue me if there are problems ;)

[ci-image]: https://www.codeship.io/projects/7a3ccd60-007e-0131-284f-0a85da757f94/status
[nodei.co]: https://nodei.co/npm/lasso.png?downloads=true
[dependencies-image]: https://david-dm.org/bahmutov/lasso.png
[dependencies-url]: https://david-dm.org/bahmutov/lasso
[endorse-image]: https://api.coderwall.com/bahmutov/endorsecount.png
[endorse-url]: https://coderwall.com/bahmutov
