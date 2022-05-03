module.exports = function (grunt) {
  "use strict";

  grunt.initConfig({
    jshint: {
      all: ['Gruntfile.js', 'src/*.js', 'spec/*.js']
    },
    jasmine: {
      options: {
        // See https://github.com/gruntjs/grunt-contrib-jasmine/issues/339
        version: '3.8.0',
        noSandbox: true,
        specs: 'spec/*.spec.js'
      },
      all: 'src/*.js'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint', 'jasmine']);
};
