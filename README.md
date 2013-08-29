# node-boilerplate

Basic boilerplate with:

1. Grunt
2. JSHint
3. RequireJS
4. Jade
5. SCSS
6. Watch

## Requirements

1. Node.js
2. SASS - install Ruby and then: `gem install sass`

## Usage

1. Download and copy to your project: `Gruntfile.js`, `.jshint*`.
2. Install dependencies:
```
npm install --save-dev grunt grunt-cli grunt-contrib-jshint grunt-contrib-requirejs grunt-contrib-watch grunt-contrib-sass grunt-contrib-jade grunt-contrib-cssmin
```

3. Review and apply your configuration to: `vim Gruntfile.js`

## Notes

1. RequireJS is pre-configured to uglify and concatenate all browser js files. If your RequireJS module 
   depends on external script (say angular.js loaded from the CDN), you have to define it in Gruntfile.js
   as well, but the URL is unimportant. Example:

```
    requirejs: {
      compile: {
        options: {
          baseUrl: 'views/js',
          out: 'static/js/main.js',
          name: 'main',
          paths: {
            /* Example for angular */
            'controllers': 'controllers/',
            'angular': '//lorem1.ipsum',      // //lorem1.ipsum URL has no meaning here
          },
          optimize: 'uglify2',
          logLevel: 0,
          preserveLicenseComments: false,
          generateSourceMaps: true
        }
      }
    },
```

