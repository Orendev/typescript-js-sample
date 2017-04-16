'use strict';

const gulp = require('gulp');
const svgSprite = require("gulp-svg-sprites");

module.exports = function (options) {
    return function (callback) {
        return gulp.src(options.src)
            .pipe(svgSprite({
                mode: 'sprite',
                svg: {
                    sprite: "images/svg/spite.svg"
                },
                cssFile: "css/sprite.css",
                layout: "vertical",
                selector: "icon-%f"
            }))
            .pipe(gulp.dest(options.dist));
    }
};

// .pipe($.rename(function (path) {
//     path.dirname = "/svg/";
// }))