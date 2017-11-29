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
        },
        run: {
            'install-example': {
                exec: 'cd ./example/ && npm install'
            },
            example: {
                exec: 'cd ./example/ && tsc && node app.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-publish');
    grunt.loadNpmTasks('grunt-run');

    grunt.registerTask('release', ['clean', 'copy', 'publish']);
    grunt.registerTask('example', ['run:install-example', 'run:example']);
};