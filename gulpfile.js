'use strict';

var syrup = require('syrup');
var gulp = require('gulp');
var githubPages = require('gulp-gh-pages');

var isDev = process.argv.indexOf('--dev') !== -1;

syrup.gulp.init(gulp, { compressJs: !isDev });

gulp.task('deploy', ['build'], function() {
  return gulp.src('./build/**/*').pipe(githubPages({
    remoteUrl: 'git@github.com:drschwenk/textbook-annotation-webapp.git'
  }));
});
