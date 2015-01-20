var appConfig = require('./appConfig.js');

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-express');

  grunt.initConfig({
    /***
    Development Server */
    express: {
      all: {
        options: {
          port: 3000,
          hostname: "0.0.0.0",
          open: true,
          livereload: true,
          bases: ['app']
        }
      }
    },

    /***
    Clean the build directory */
    clean: ['app/build'],

    /***
    Concatenate JavaScript Files */
    concat: {
      options: {
        stripBanners: true
      },
      vendor: {
        src: appConfig.vendorDependencies.scripts,
        dest: 'app/build/vendor.js'
      }
    },

    /***
    Minify JavaScript Files */
    uglify: {
      options: {
        sourceMap: true
      },
      vendor: {
        files: {
          'app/build/vendor.min.js': ['<%= concat.vendor.dest %>']
        }
      }
    }

    /////////////////////
  });

  grunt.registerTask('build:vendor', ['concat:vendor', 'uglify:vendor']);
  grunt.registerTask('build', ['clean', 'build:vendor']);
  grunt.registerTask('serve', ['express', 'express-keepalive']);

};
