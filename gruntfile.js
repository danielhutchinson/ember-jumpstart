var appConfig = require('./appConfig.js');

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-es6-module-transpiler');
  grunt.loadNpmTasks('grunt-ember-templates');

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
    Transpile ES6 Files */
    transpile: {
        app: {
            type: 'amd',
            moduleName: function (path) {
                return 'example/' + path;
            },
            files: [{
                expand: true,
                cwd: 'app/scripts/',
                src: '**/*.js',
                dest: 'app/build/transpiled/'
            }]
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
      },
      app: {
        src: 'app//build/transpiled/**/*.js',
        dest: 'app/build/app.js'
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
      },
      app: {
        files: {
          'app/build/app.min.js': ['<%= concat.app.dest %>']
        }
      },
      templates: {
        files: {
          'app/build/templates.min.js' : ['app/build/templates.js']
        }
      }
    },

    /***
    Compile Ember Templates */
    emberTemplates: {
      compile: {
        options: {
          templateBasePath: 'app/templates',
          templateName: function (sourceFile) {
            return sourceFile.replace("templates/", "");
          }
        },
        files: {
          'app/build/templates.js' : 'app/templates/**/*.handlebars'
        }
      }
    }

    /////////////////////
  });

  grunt.registerTask('build:vendor', ['concat:vendor', 'uglify:vendor']);
  grunt.registerTask('build:app', ['transpile:app', 'concat:app', 'uglify:app']);
  grunt.registerTask('build:templates', ['emberTemplates', 'uglify:templates']);
  grunt.registerTask('build', ['build:vendor', 'build:templates', 'build:app']);
  grunt.registerTask('serve', ['express', 'express-keepalive']);
  grunt.registerTask('default', ['build', 'serve']);

};
