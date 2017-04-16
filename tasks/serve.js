'use strict';
const gulp = require('gulp');
const browserSync = require('browser-sync').create();


module.exports = function(options) {
    return function (callback) {
        browserSync.init({
            server: options.dist
        });
        browserSync.watch(options.src).on('change', browserSync.reload);
    }

};
