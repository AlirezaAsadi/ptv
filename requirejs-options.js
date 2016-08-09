/*
 * r.js build optimizer
 * see full list of options at: https://github.com/jrburke/r.js/blob/master/build/example.build.js
 */

var grunt = require('grunt');

module.exports = {
  appDir: 'static/',
  baseUrl: 'js/',
  mainConfigFile: 'static/js/config-build.js',
  dir: 'static-prod',
  preserveLicenseComments: false,
  optimize: 'uglify2',
  modules: [
    // First set up the common build layer.
    {
      // module names are relative to baseUrl
      name: 'modules/home/init',
      // List common dependencies here. Only need to list
      // top level dependencies, 'include' will find
      // nested dependencies.
      // look for common.js in html/static/js/

      //exclude: ["react", "JSXTransformer", "text"]
    },

    // Now set up a build layer for each main layer, but exclude
    // the common one. If you're excluding a module, the excludee
    // must appear before the excluder in this file. Otherwise it will
    // get confused.
    {
      name: 'modules/profile/init'
    },

    {
      name: 'modules/room/init'
    },

    {
      name: 'modules/network/init'
    },
    // TODO the reset main js files
  ],

  // exclude folders
  //fileExclusionRegExp: /^templates$|^templates_1--in-progress$|^templates_2--ready$|^templates_3--archived$|^scss$|^docs$|^index.html$|^index.php$|^mediaLibrary$|^_userProfileImages$|^app_uploads$/,

  uglify2: {
      //Example of a specialized config. If you are fine
      //with the default options, no need to specify
      //any of these properties.
      output: {
          beautify: false
      },
      compress: {
          drop_console: true,
          // pure_funcs: [ 'console.log' ]
      },
      warnings: true,
      mangle: false
  }

  /** Check duplicate modules
  done: function(done, output) {
    var duplicates = require('rjs-build-analysis').duplicates(output);

    if (Object.keys(duplicates).length > 0) {
      grunt.log.subhead('Duplicates found in requirejs build:');
      for (var key in duplicates) {
        grunt.log.error(duplicates[key] + ": " + key);
      }
      return done(new Error('r.js built duplicate modules, please check the excludes option.'));
    } else {
      grunt.log.success("No duplicates found!");
    }

    done();
  }
  */
};
