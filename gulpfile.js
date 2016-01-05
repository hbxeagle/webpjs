'use strict';

var gulp = require('gulp');

// Load plugins
var $ = require('gulp-load-plugins')();


/* es6 */
gulp.task('es6', function() {
  
  return gulp.src('src/*.js')
    .pipe($.plumber())
    .pipe($.babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('dist'))
    .pipe($.uglify())
    .pipe($.rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('dist'));

});


gulp.task('watch', ['es6'], function() {

  gulp.watch(['src/*.js'], ['es6']);

});


gulp.task('default', function() {
  gulp.start('watch');
});
