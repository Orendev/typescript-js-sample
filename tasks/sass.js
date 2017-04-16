'use strict';
const $ = require('gulp-load-plugins')();
const gulp = require('gulp');
const combine = require('stream-combiner2').obj;
const urlAdjuster = require('gulp-css-url-adjuster');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';


module.exports = function(options) {
    return function(callback) {
        return combine(
            gulp.src(options.src),
            $.autoprefixer(),
            $.remember('sass'),
            $.if(isDevelopment, $.sourcemaps.init()),
            $.sass({
                includePaths: options.patchs
            }),
            urlAdjuster({
                prepend: '../images/',
                append: '?version=1',
            }),
            $.autoprefixer({
                browsers: ['last 2 versions', 'ie >= 9']
            }),
            $.if(isDevelopment, $.sourcemaps.write('.')),
            $.if(!isDevelopment, combine($.csso())),
            gulp.dest(options.dist)
        ).on('error', $.notify.onError(function(err) {
            return {
                title: 'Sass',
                message: err.message
            };
        }));
    }

};