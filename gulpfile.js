'use strict';

const gulp = require('gulp');


const named = require('vinyl-named');
const path = require('path');
const gulplog = require('gulplog');
const AssetsPlugin = require('assets-webpack-plugin');
const $ = require('gulp-load-plugins')();
const webpackStream = require('webpack-stream');
const webpack = webpackStream.webpack;

const webpackConfig = require('./webpack.config.ts.js');


const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';


function lazyRequireTask(taskName, path, options) {
    options = options || {};
    options.taskName = taskName;
    gulp.task(taskName, function(callback) {
        let task = require(path).call(this, options);
        return task(callback)
    })
}

let sassPaths = [
    'bower_components/normalize.scss/sass',
    'bower_components/foundation-sites/scss',
    'bower_components/motion-ui/src',
    './header.scss'
];

lazyRequireTask('sass', './tasks/sass', {
    src: 'src/sass/app.scss',
    dist: 'dist/css',
    patchs: sassPaths
});

lazyRequireTask('clean', './tasks/clean', {
    dist: 'dist'
});


lazyRequireTask('assets', './tasks/assets', {
    src: 'src/assets/**/*.*',
    dist: 'dist'
});

lazyRequireTask('sass:assets', './tasks/sass_assets', {
    src: 'src/sass/**/*.{png,jpg}',
    dist: 'dist/images'
});

lazyRequireTask('sass:svg', './tasks/svg', {
    src: 'src/sass/**/*.svg',
    dist: 'dist'
});

lazyRequireTask('serve', './tasks/serve', {
    src: 'src/**/*.*',
    dist: 'dist',
});


lazyRequireTask('lint', './tasks/lint', {
    src: 'dist/**/*.js',
    cacheFilePath: process.cwd() + '/tmp/lintCache.json'
});

gulp.task('webpack', function(callback) {
    let firstBuildReady = false;

    function done(err, stats) {
        firstBuildReady = true;

        if (err) {
            return;
        }
        gulplog[stats.hasErrors() ? 'error' : 'info'](stats.toString({
            colors: true
        }))
    }
    return gulp.src('./src/app/*.ts')
        .pipe($.plumber({
            errHandler: $.notify.onError(err => ({
                title: 'Webpack',
                message: err.message
            }))
        }))
        .pipe(named())
        .pipe(webpackStream(webpackConfig, null, done))
        .pipe($.if(!isDevelopment, $.uglify()))
        .pipe(gulp.dest('dist/js'))
        .on('data', function() {
            if (firstBuildReady) {
                callback();
            }
        })
});



gulp.task('watch', function() {
    gulp.watch('src/sass/**/*.scss', gulp.series('sass')).on('unlink', function(filepath) {
        $.remember.forget('sass', path.resolve(filepath))
    });
    gulp.watch('src/assets/**/*.*', gulp.series('assets'));
    gulp.watch('src/sass/**/*.{jpg,png}', gulp.series('sass:assets'));
    gulp.watch('src/sass/**/*.svg', gulp.series('sass:svg'))
});


gulp.task('build', gulp.series(
    'clean',
    gulp.parallel(
        'sass:assets',
        'sass:svg',
        'sass',
        'webpack'),
    'assets'
));

gulp.task('dev',
    gulp.series(
        'build',
        gulp.parallel(
            'serve',
            'watch'
        )
    )
);