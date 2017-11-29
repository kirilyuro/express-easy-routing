module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            dist: ['dist']
        },
        copy: {
            dist: {
                files: [
                    { expand: true, cwd: 'src/', src: '**', dest: 'dist/' },
                    { expand: true, src: ['package.json', 'README.md'], dest: 'dist/' }
                ]
            }
        },
        publish: {
            dist: {
                src: ['dist']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-publish');

    grunt.registerTask('release', ['clean', 'copy', 'publish']);
};