(function () {
    'use strict';

	module.exports = function(grunt) {

	  // Project configuration.
	  grunt.initConfig({
	    pkg: grunt.file.readJSON('package.json'),


        // bless: {
        //     css: {
        //         options: {
        //             // logCount: true
        //         },
        //         files: {
        //             'html/static/css/main-bless.css': 'html/static/css/main.css',
        //             'html/static/css/main-high-contrast-bless.css': 'html/static/css/main-high-contrast.css'
        //         }

        //         // src: [
        //         //   'html/static/css/main.css'
        //         // ]
        //     }
        // },

        projectUpdate: {
            update: {
              npm: true,
              bower: true
            }
          },

    
        clean: {
            release: 'html/static-prod'
        },
        copy: {
            main: {
                src: 'html/static/js/config.js',
                dest: 'html/static/js/config-build.js',
                options: {
                    process: function(content, srcpath) {
                        return content; //.replace("/static/js", "/static-prod/js");
                    }
                }
            }
        },

        requirejs: {
            compile: {
                options: require('./requirejs-options')
            }
        },

        autoprefixer: {

            options: {
                // Task-specific options go here.
                browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'ie 9']
                
            },

            dev: {
                options: {
                    map: true
                },

                files: [
                    {
                        src: 'html/static/css/main.css',
                        dest: 'html/static/css/main.css'
                    }
                ]
                
            },

            prod: {
                files: [
                    {
                        src: 'html/static/css/main.css',
                        dest: 'html/static/css/main.css'
                    }
                ]
            }
           
        },

        sass: {
            dev: { // libsass
                files: [
                    {
                        expand: true,
                        cwd: 'html/static/scss',
                        src: ['**/*.scss'],
                        dest: 'html/static/css',
                        ext: '.css'
                    }
                ],
                options: {                       // Target options
                    sourceMap: true,
                    outputStyle: 'nested',
                    sourceComments: true
                }
            },
            prod: {
                files: [
                    {
                        expand: true,
                        cwd: 'html/static/scss',
                        src: ['**/*.scss'],
                        dest: 'html/static/css',
                        ext: '.css'
                    }
                ],
                options: {                       // Target options
                    sourceMap: false,
                    outputStyle: 'compressed'
                }
            }

        },

        watch: {
            configFiles:{
                files: ['Gruntfile.js'],
                options: {
                  reload: true
                }
            },
            css: {
                // We watch and compile sass files as normal but don't live reload here
                files: ['html/static/scss/{,*/}*.scss'],
                tasks: ['sass:dev', 'autoprefixer:dev'],
            },
            livereload: {
                files: ['*.html', '*.php', 'html/static/js/**/*.{js,json}', 'html/static/css/*.css','html/static/images/**/*.{png,jpg,jpeg,gif,webp,svg}'],
                options: {
                    livereload: true
                }
            },
            hint: {
                files: ['<%= jshint.files %>'],
                tasks: ['jshint']
            }
        },


        jshint: {
            files: [
                  'Gruntfile.js',
                  'server/*.{js,json}',
                  'server/controllers/**/*.{js,json}',
                  'server/models/**/*.{js,json}',
                  'server/constraints/**/*.{js,json}',
                  'server/config/**/*.{js,json}',
                 ],
             options: {
                loopfunc: true,
                laxcomma: false,
                validthis: true
             }
        },

	  });

        grunt.loadNpmTasks('grunt-project-update');
        grunt.loadNpmTasks('grunt-requirejs');

        grunt.loadNpmTasks('grunt-project-update');

        grunt.loadNpmTasks('grunt-contrib-clean');

        grunt.loadNpmTasks('grunt-contrib-copy');

        grunt.loadNpmTasks('grunt-contrib-compress');

        grunt.loadNpmTasks('grunt-sass');
        //grunt.loadNpmTasks('grunt-bless');

        grunt.loadNpmTasks('grunt-contrib-watch');

        grunt.loadNpmTasks('grunt-autoprefixer');


        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-notify');

		// Default task(s).
		grunt.registerTask('default', ['jshint' , 'sass:dev', 'autoprefixer:dev', 'watch']);

        grunt.registerTask('build', ['jshint' , 'sass:prod', 'autoprefixer:prod', 'clean', 'copy', 'requirejs']);

	};

}());