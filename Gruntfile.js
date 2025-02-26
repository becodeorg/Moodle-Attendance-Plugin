module.exports = function(grunt) {
    // Initialize Grunt configuration
    grunt.initConfig({
        uglify: {
            build: {
                files: [{
                    expand: true,
                    cwd: 'amd/src',  // Source directory for AMD JS files
                    src: '**/*.js',  // Include all .js files
                    dest: 'amd/build',  // Destination directory
                    ext: '.min.js'  // Minified file extension
                }]
            }
        },
        watch: {
            scripts: {
                files: ['amd/src/**/*.js'], // Watch for changes in the 'src' directory
                tasks: ['uglify'],  // Run 'uglify' task on change
                options: {
                    spawn: false
                }
            }
        }
    });

    // Load Grunt plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Register default task
    grunt.registerTask('default', ['uglify']);
};
