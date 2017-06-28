/**
 * @author yue on 17/6/25.
 * @fileOverview
 */
var gulp = require('gulp');
var fs=require('fs');
var argv = require('yargs').argv;

var options = {
    target : "https://app.convertlab.com",
    destPath : "./dist",
    // destPath : "dist/",
    prebuild :"./prebuild",
    src : "./app/",
    watch: 'app/',
    tmp : './',
    es6_list: []
};

function setWatchFile(options) {
    if (argv.watch) {
        var watch = options.watch + argv.watch;
        if (fs.existsSync(watch)) {
            options.watch = watch;
            console.log('------ watch folder ' + argv.watch + ' ------');
        }
    }
}

setWatchFile(options);

fs.readdirSync('./gulp/').map(function (fileName) {
    if (fileName.indexOf('.js') > 0 && fileName != 'worker.js') {
        require('./gulp/' + fileName)(options);
    }
});

// 注释 不要删除！
// jspm bundle jquery + jquery-ui + bootstrap + react + react-dom + redux + react-redux + antd + echarts cl_lib.js --inject --minify --no-mangle
var less = require("gulp-less");
gulp.task('merge_ant_less', function() {
    gulp.src(['jspm_packages/npm/antd@2.11.1/dist/antd.less'])
        .pipe(less())
        .pipe(gulp.dest('ant.css'))

});



