module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['src/js/actions.js', 'src/js/main.js', 'src/js/vendor/fuse.min.js'],
        dest: 'dist/built.js',
      },
    },
    watch: {
      js: {
        files: [
          'src/**'
        ],
        tasks: [
          'default',
        ]
      }
    },
    copy: {
      main: {
        files: [
          {expand: true, flatten: true, src: ['src/**', '!src/js/**'], dest: 'dist/', filter: 'isFile'}
        ]
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.registerTask('default', ['copy', 'concat']);
}