module.exports = function (grunt) {
    grunt.initConfig({
        /**
         * Task para a compilação do sass
         */
        sass: {
            dist: {
                options: {
                    // sourcemap: 'none',
                    style: 'compressed',
                    update: true,
                },
                files: {
                    './src/index.css': './src/styles/index.scss',
                },
            },
        },
        watch: {
            files: ['./src/styles/*.scss'],
            tasks: ['default'],
        },
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerTask('default', ['sass', 'watch']);
    grunt.registerTask('release', ['sass']);
};
