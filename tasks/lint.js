'use strict';
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const fs = require('fs');
const through2 = require('through2').obj;
const combine = require('stream-combiner2').obj;

module.exports = function (options) {
    let esLintResults = {};
    let cacheFilePath =  options.cacheFilePath;

    return function (calback) {
        try{
            esLintResults = JSON.parse(fs.readFileSync(cacheFilePath));
        }catch (e){

        }

        return gulp.src(options.src, {read: false})
            .pipe($.if(function (file) {
                    return esLintResults[file.path] && esLintResults[file.path].mtime == file.stat.mtime.toJSON()
                },
                through2(function (file, enc, callback) {
                    file.eslint = esLintResults[file.path].eslint;
                    callback(null, file)
                }),
                combine(
                    through2(function (file, enc, callback) {
                        file.contents = fs.readFileSync(file.path);
                        callback(null, file);
                    }),
                    $.eslint(),
                    through2(function (file, enc, callback) {
                        esLintResults[file.path] = {
                            eslint: file.eslint,
                            mtime: file.stat.mtime
                        };
                        callback(null, file);
                    })
                )
            ))
            .pipe($.eslint.format())
            .on('end', function () {
                fs.writeFileSync(cacheFilePath, JSON.stringify((esLintResults)));
            })
            .pipe($.eslint.failAfterError());
    }
};