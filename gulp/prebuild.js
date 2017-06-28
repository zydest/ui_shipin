/**
 * @author yue on 17/6/25.
 * @fileOverview
 */
/**
 * Created by yue on 16/8/28.
 */
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var jspm = require('jspm');
var babel = require('gulp-babel');
var runSequence = require('run-sequence');
var less = require('gulp-less');
var symlink = require('gulp-sym');

/*
 * The proxy middleware is an Express middleware added to BrowserSync to
 * handle backend request and proxy them to your backend.
 */
module.exports = function (options) {

    var prebuild = options.prebuild;
    var watch = options.watch;


    gulp.task('copy_html', function (cb) {
        return gulp.src([watch + '**/*.html', 'index.html'], {base: '.'})
            .pipe(gulp.dest(prebuild));
    });


    gulp.task('copy_build_js', function (cb) {
        return gulp.src(['ui_lib.js'], {base: '.'})
            .pipe(gulp.dest(prebuild));
    });


    gulp.task('copy_jspm', function (cb) {
        return gulp.src(['jspm_packages/**/*'], {base: '.'})
            .pipe(gulp.dest(prebuild));
    });

    gulp.task('config:copy', function() {
        return gulp.src('config.js', {base: '.'})
            .pipe(gulp.dest(prebuild))
    });

    gulp.task('copy_assets', function() {
        return gulp.src(['assets/**/*'], {base: '.'})
            .pipe(gulp.dest(prebuild))
    });

    gulp.task('app:js', function (cb) {
        return gulp.src([watch + '**/**/*.js', '!config.js'], {base: '.'})
            .pipe(sourcemaps.init())
            .pipe(babel({
                presets : [ 'react', 'es2015', 'stage-0'],
                plugins: ['transform-es2015-modules-systemjs',"transform-strip-svg-sprite", ['import', {libraryName: 'antd-mobile'}]]
            }))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(prebuild));
    });

    gulp.task('es5', function (cb) {
        return gulp.src([watch + '**/**/*.js', '!config.js'], {base: '.'})
            .pipe(sourcemaps.init())
            .pipe(babel({
                presets : [ 'react', 'es2015', 'stage-0'],
                plugins: ['transform-es2015-modules-systemjs', ['import', {"style": "css",libraryName: 'antd-mobile'}]]
            }))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(prebuild));
    });

    gulp.task('app:less', function (cb) {
        return gulp.src([watch + '/**/*.less'], {base: '.'})
            .pipe(sourcemaps.init())
            .pipe(less({relativeUrls: true}))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(prebuild));
    });




    gulp.task('pre', function(cb) {
        var tasks = [
            'copy_html',
            'copy_build_js',
            'copy_jspm',
            'config:copy',
            'copy_assets',
            'app:js',
            'app:less'
        ];

        runSequence(tasks, cb);
    });
};
