/**

  Configuration:
  1. WEB_DIRS - list of directories containing JADE and SCSS templates.
                Those directories will JSHint'ed uding .jshintrc 
                and .jshintrc.web.
  2. NODE_DIRS - list of directories containing node's app. 
                Those directories will be JSHint'ed using .jshintrc
                and .jshintrc.node.
  3. Specific paths for Grunt tasks.

  Usage:
    $ grunt
    $ grunt [--production] [watch]
*/

var WEB_DIRS = ['./views'];
var NODE_DIRS = ['./bin', './lib'];

module.exports = function (grunt) {
  'use strict';

  var path = require('path');

  var JS = '.js'
    , SCSS = '.scss'
    , JADE = '.jade'
    ;

  var ALL_DIRS = WEB_DIRS.concat(NODE_DIRS);

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  var PROD = grunt.option('production') !== undefined;
  grunt.log.write('Using ' + (PROD ? 'production' : 'development') + ' settings');

  grunt.initConfig({
    jshint: {
      node: {
        options: mergeJSON('.jshintrc', '.jshintrc.node'),
        files: { 
          src: files(NODE_DIRS, JS) 
        }
      },
      web: {
        options: mergeJSON('.jshintrc', '.jshintrc.web', {ignores: []}, PROD ? {} : {debug: true, devel: true}),
        files: {
          src: files(WEB_DIRS, JS)
        }
      }
    },
    sass: {
      dist: {
        files: {
          'views/styles/main.css': files('views/styles', SCSS)
        }
      }
    },
    cssmin: {
      min: {
        files: {
          'static/styles/main.min.css': 'views/styles/main.css'
        }
      }
    },
    jade: {
      compile: {
        files: jade_one_per_template('static/', 'views/')
      }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: 'views/js',
          out: 'static/js/main.js',
          name: 'main',
          paths: {
            /* Example for angular */
            //'angular': '//lorem1.ipsum',
            //'ui-bootstrap': '//lorem2.ipsum'
          },
          optimize: 'uglify2',
          logLevel: 0,
          preserveLicenseComments: false,
          generateSourceMaps: true
        }
      }
    },
    watch: {
      node_js: {
        files: files(NODE_DIRS, JS),
        tasks: ['jshint']
      },
      web_js: {
        files: files(WEB_DIRS, JS),
        tasks: ['requirejs', 'jshint'],
      },
      scss: {
        files: files(WEB_DIRS, SCSS),
        tasks: ['sass', 'cssmin']
      },
      jade: {
        files: files(WEB_DIRS, JADE),
        tasks: ['jade']
      }
    }
  });

  grunt.registerTask('default', ['sass', 'cssmin', 'jshint', 'jade', 'requirejs']);
  grunt.registerTask('watch', ['watch']);


  /*
    Merges all JSON files given as arguments (relative to the current dir).
    Object can be given instead of JSON file path.

    Usage:

      merge('file1', 'file2', 'file3', {a: 1});
  */
  function mergeJSON () {
    var json = [];
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i];
      json.push(typeof arg === 'string' ? grunt.file.readJSON(arguments[i]) : arg);
    }

    return grunt.util._.merge.apply(grunt.util._, json);
  }

  /*
    Given list of file extensions and list of directories, return list of globbed (using '*')
    paths containing all of the files.
    This function does recurse.

    Example:

      ./
        - bin/
          - index.js
          - app.js
       - lib/
          - stuff/
            - a.js

      files(['./bin', './lib'], '.js') === ['./bin/*.js', './lib/stuff/*.js']
  */
  function files (dirs, extensions) {
    if (!Array.isArray(dirs)) { dirs = [dirs]; }
    if (!Array.isArray(extensions)) { extensions = [extensions]; }

    var res = [];

    for (var d = 0, l = dirs.length; d < l; d++) {
      grunt.file.recurse(dirs[d], function (abspath, rootdir, subdir, filename) {
        var ext = extensions.indexOf(path.extname(filename));
        if (ext >= 0) {
          var globb = path.dirname(abspath) + '/*' + extensions[ext];
          if (res.indexOf(globb) < 0) {
            res.push(globb);
          }
        }
      });
    }

    return res;
  }

  function jade_one_per_template (output_dir, input_dir) {
    if (typeof output_dir !== 'string') {
      throw new Error('output_dir should be a path');
    }

    if (typeof input_dir !== 'string') {
      throw new Error('input_dir should be a path');
    }

    var res = {};

    grunt.file.recurse(input_dir, function (abspath, rootdir, subdir, filename) {
      if (JADE === path.extname(filename)) {
        res[path.basename(abspath, JADE)] = abspath;
      }
    });

    console.log(res);

    return res;
  }

};
