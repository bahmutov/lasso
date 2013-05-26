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
                src: [ '*.js', 'src/*.js' ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('default', ['jshint']);
};