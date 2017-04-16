'use strict';
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();


module.exports = function (options) {
    return function (callback) {
        return gulp.src(options.src, {since: gulp.lastRun('sass:assets')})
            .pipe($.newer(options.src))
            .pipe($.rename(function (path) {
                path.dirname = "/";
            }))
            .pipe(gulp.dest(options.dist));
    }
};
