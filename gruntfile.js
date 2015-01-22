var appConfig = require('./appConfig.js');

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-es6-module-transpiler');
  grunt.loadNpmTasks('grunt-ember-templates');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-libsass');

  grunt.initConfig({
    /***
    Development Server */
    express: {
      all: {
        options: {
          port: 3000,
          hostname: "*",
          open: true,
          livereload: true,
          bases: ['app']
        }
      }
    },

    /***
    Run JSHint on app files */
    jshint: {
      all: ['app/scripts/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
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
              dest: 'app/temp/transpiled/'
          }]
      }
    },

    /***
    Clean the build and temp directories */
    clean: ['app/build', 'app/temp'],

    /***
    Concatenate JavaScript Files */
    concat: {
      options: {
        stripBanners: true
      },
      vendor: {
        src: appConfig.vendorDependencies.scripts,
        dest: 'app/build/js/vendor.js'
      },
      app: {
        src: 'app/temp/transpiled/**/*.js',
        dest: 'app/build/js/app.js'
      },
      styles: {
        src: appConfig.vendorDependencies.styles,
        dest: 'app/build/css/vendor.css'
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
          'app/build/js/vendor.min.js': ['<%= concat.vendor.dest %>']
        }
      },
      app: {
        files: {
          'app/build/js/app.min.js': ['<%= concat.app.dest %>']
        }
      },
      templates: {
        files: {
          'app/build/js/templates.min.js' : ['app/build/js/templates.js']
        }
      }
    },

    /***
    Minify CSS Files */
    cssmin: {
      vendor: {
        files: {
          'app/build/css/vendor.min.css': ['app/build/css/vendor.css']
        }
      },
      app: {
        files: {
          'app/build/css/app.min.css': ['app/build/css/app.css']
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
          'app/build/js/templates.js' : 'app/templates/**/*.handlebars'
        }
      }
    },

    /***
    Copy Files */
    copy: {
      fonts: {
        expand: true,
        flatten: true,
        src: appConfig.vendorDependencies.fonts,
        dest: 'app/build/fonts/'
      }
    },

    /***
    Compile SASS Files */
    libsass: {
      app: {
        src: 'app/styles/main.scss',
        dest: 'app/build/css/app.css'
      }
    },

    /***
    Watchers */
    watch: {
      options: {
        spawn: true,
        interrupt: true,
        //livereload: true
      },
      app: {
        files: 'app/scripts/**/*.js',
        tasks: ['build:app']
      },
      templates: {
        files: 'app/templates/**/*.handlebars',
        tasks: ['build:templates']
      },
      styles: {
        files: 'app/styles/**/*.scss',
        tasks: ['build:styles']
      }
    }

    /////////////////////
  });

  grunt.registerTask('build:vendor', ['concat:vendor', 'concat:styles', 'copy:fonts', 'cssmin:vendor', 'uglify:vendor']);
  grunt.registerTask('build:styles', ['libsass', 'cssmin:app']);
  grunt.registerTask('build:app', ['jshint', 'transpile:app', 'concat:app', 'uglify:app']);
  grunt.registerTask('build:templates', ['emberTemplates', 'uglify:templates']);
  grunt.registerTask('build', ['clean', 'build:vendor', 'build:styles', 'build:templates', 'build:app']);
  grunt.registerTask('serve', ['express', 'watch']);
  grunt.registerTask('default', ['build', 'serve']);

};
