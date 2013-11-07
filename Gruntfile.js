/*global module:false*/
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                ignores: [
                    'src/testacular.conf.js'
                ]
            },
            'default': {
                src: ['*.js', 'src/*.js']
            }
        },
        'nice-package': {
            all: {}
        },
        complexity: grunt.file.readJSON('complexity.json')
    });

    var plugins = module.require('matchdep').filterDev('grunt-*');
    plugins.forEach(grunt.loadNpmTasks);

    grunt.registerTask('default', ['jshint', 'nice-package', 'complexity']);
};
