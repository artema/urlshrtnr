var AWS = require('aws-sdk');

var credentials = new AWS.SharedIniFileCredentials({profile: 'me'});
AWS.config.credentials = credentials;

var gulp = require('gulp');
var babel = require('gulp-babel');
var del = require('del');
var install = require('gulp-install');
var lambda = require('gulp-awslambda');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var zip = require('gulp-zip');

require('babel/register');
runSequence.use(gulp);

gulp.task('clean', function(cb) {
  del(['./dist'], cb)
})

gulp.task('compile', function () {
  return gulp
    .src('src/**/*.js')
    .pipe(babel({ optional: ['runtime'] }))
    .pipe(gulp.dest('dist/src/'))
})

gulp.task('handler', function () {
  return gulp
    .src('./lambda-handler.js')
    .pipe(rename('index.js'))
    .pipe(gulp.dest('dist/'))
})

gulp.task('node-mods', function() {
  return gulp
    .src('./package.json')
    .pipe(gulp.dest('dist/'))
    .pipe(install({ production: true }))
})

gulp.task('zip', function() {
  return gulp.src(['dist/**/*'])
    .pipe(zip('dist/dist.zip'))
    .pipe(gulp.dest('./'))
})

gulp.task('lambda-zip', function(callback) {
  return runSequence(
    ['clean'],
    ['compile', 'handler', 'node-mods'],
    ['zip'],
    callback
  )
})

gulp.task('upload', function(callback) {
  return gulp.src('./dist/dist.zip')
    .pipe(lambda(require('./lambda-config.js'), { region: 'eu-west-1' }))
})

gulp.task('deploy', function(callback) {
  return runSequence(
    ['lambda-zip'],
    ['upload'],
    callback
  )
})
