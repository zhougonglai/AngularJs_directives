/**
 * Created by dulin on 2015/4/24.
 */
module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            build: {
                files: {
                    './release/js/app.min.js': ['./app/*.js']
                }
            }
        },
        cssmin: {
            build: {
                files: {
                    './release/css/app.min.css': './css/*.css'
                }
            }
        },
        connect: {
            server: {
                options: {
                    base: '.',
                    port: 3000,
                    hostname: '*',
                    open: true
                }
            }
        },
        html2js: {
            main: {
                src: ['./templates/*.html'],
                dest: './app/templates.js'
            }
        },
        watch: {
            css: {
                files: './css/*.css',
                tasks: ['cssmin']
            },
            js: {
                files: ['./libs/*.js', './app/*.js'],
                tasks: ['uglify']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', [
        'html2js',
        'uglify',
        'cssmin'
    ]);
};