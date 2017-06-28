/**
 * @author yue on 17/6/25.
 * @fileOverview
 */
var gulp = require('gulp');
var webserver = require('gulp-webserver');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');

module.exports = function(options) {
    var middleware = require('./proxy')(options);
    gulp.task('watch', function() {
        var watch = options.watch ;
        var prebuild = options.prebuild;

        gulp.watch(['app/**/*.js', '!config.js'], function (file) {
            var path = file.path;
            console.log(path);
            try {
                gulp.src(path, {base: '.'})
                    .pipe(sourcemaps.init())

                    .pipe(babel({
                        presets : [ 'react', 'stage-2'],
                        plugins: ['transform-es2015-modules-systemjs', "inline-react-svg", ['import', {libraryName: 'antd-mobile'}]]
                    }))

                    .pipe(sourcemaps.write('.'))
                    .pipe(gulp.dest(prebuild));
            } catch(e) {
                console.log(e.name, e.message);
            }

        });
        gulp.watch(watch + '/**/*.html', ['copy_html']);
        gulp.watch(watch + '/**/*.css', ['copy_css']);
        gulp.watch(watch + '/**/*.less', ['app:less']);
    });

    gulp.task('serve', ['watch'], function() {
        gulp.src('.')
            .pipe(webserver({
                livereload: true,
                directoryListing: true,
                open: '/',
                port: 3000,
                middleware: middleware[0]
            }));
    });

    gulp.task('serve:dist', ['watch'], function() {
        gulp.src(options.destPath)
            .pipe(webserver({
                livereload: false,
                directoryListing: true,
                open: '/',
                port: 3000,
                middleware: middleware[0]
            }));
    });
};

