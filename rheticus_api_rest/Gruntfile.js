module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    execute: {
      target: {
        src: ['server.js']
      }
    }
  });

  // Load the plugin that provides the "execute" task. (https://www.npmjs.com/package/grunt-execute)
  grunt.loadNpmTasks('grunt-execute');

  // Default task(s).
  grunt.registerTask('default', ['execute']);

};
