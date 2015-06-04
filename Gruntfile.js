module.exports = function (grunt) {
  "use strict";

  grunt.initConfig({
    jshint: {
      options: {
        '-W053': true
      },
      all: ['Gruntfile.js', 'src/*.js', 'spec/*.js']
    },
    jasmine: {
      options: {
        specs: 'spec/*.spec.js'
      },
      all: 'src/*.js'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint', 'jasmine']);
};
