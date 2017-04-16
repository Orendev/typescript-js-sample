'use strict';
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const revReplace = require('gulp-rev-replace');

module.exports = function(options) {
    return function(callback) {
        return gulp.src(options.src, { since: gulp.lastRun('assets') })
            .pipe($.newer(options.src))
            .pipe(gulp.dest(options.dist));
    }

};