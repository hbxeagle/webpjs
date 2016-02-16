'use strict';

var gulp = require('gulp'),
  browserSync = require('browser-sync'),
  pngquant = require('imagemin-pngquant'),
  imageminWebp = require('imagemin-webp'),
  merge = require('merge-stream'),
  fs = require('fs');

var concatfile = JSON.parse(fs.readFileSync('./concatfile.json'));
var efes = JSON.parse(fs.readFileSync('./.efesconfig'));

// Load plugins
var $ = require('gulp-load-plugins')();
var ccDeps = [];
var imgDeps = [];

/* imagemin */
gulp.task('imagemin', function() {
  var srcs = ['src/images/**/*'];
  if (concatfile.imgMinIgnore&&concatfile.imgMinIgnore.length > 0) { //获取不需要压缩的图片列表，从压缩目录中排除。
    for (var i = 0; i < concatfile.imgMinIgnore.length; i++) {
      srcs.push("!" + concatfile.imgMinIgnore[i]);
    }

    //将不需要压缩的图片copy到images目录
    gulp.src(concatfile.imgMinIgnore)
      .pipe(gulp.dest('images'))
      .pipe(browserSync.reload({
        stream: true
      }));
  }

  return gulp.src(srcs)
    .pipe($.imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('images'))
    .pipe(browserSync.reload({
      stream: true
    }));
});
ccDeps.push('imagemin');
imgDeps.push('imagemin');


/* webp */
gulp.task('webp', function() {
  var srcs = ['src/images/**/*'];

  return gulp.src(srcs)
    .pipe($.plumber())
    .pipe(imageminWebp({
      quality: 50
    })())
    .pipe(gulp.dest('images'))
    .pipe(browserSync.reload({
      stream: true
    }));
});
ccDeps.push('webp');
imgDeps.push('webp');


/*html*/
gulp.task('html', function() {
  return gulp.src('src/html/**/*.html')
    .pipe(gulp.dest('.'))
    .pipe(browserSync.reload({
      stream: true
    }));
});
ccDeps.push('html');


/* js-concat */
gulp.task('js-concat',[], function() {

  var merges = [];

  Object.keys(concatfile.pkg).forEach(function(item) {

    if (/\.js$/i.test(item)) {
      var srcs = concatfile.pkg[item];
      var publish = item;
      var conc = gulp.src(srcs)
        .pipe($.concat(publish))
        .pipe(gulp.dest('.'))
        .pipe(browserSync.reload({
          stream: true
        }));

      merges.push(conc);
    }

  });

  return merge.apply(this, merges);

});

/* css-concat */
gulp.task('css-concat', [], function() {

  var merges = [];

  Object.keys(concatfile.pkg).forEach(function(item) {

    if (/\.css$/i.test(item)) {
      var srcs = concatfile.pkg[item];

      var publish = item;
      var conc = gulp.src(srcs)
        .pipe($.concat(publish))
        .pipe(gulp.dest('.'))
        .pipe(browserSync.reload({
          stream: true
        }));

      merges.push(conc);
    }


  });

  return merge.apply(this, merges);

});

/* concat */
gulp.task('concat', ccDeps, function() {

  var merges = [];

  Object.keys(concatfile.pkg).forEach(function(item) {
    var srcs = concatfile.pkg[item];

    var publish = item;
    var conc = gulp.src(srcs)
      .pipe($.concat(publish))
      .pipe(gulp.dest('.'))
      .pipe(browserSync.reload({
        stream: true
      }));

    merges.push(conc);
  });

  return merge.apply(this, merges);

});


gulp.task('browser-sync', function() {

  if (efes.dev_url.trim()) {
    return browserSync({
      open: 'external',
      proxy: efes.dev_url
    });
  }

  return browserSync({
    open: 'external',
    server: {
      baseDir: '.'
    }
  });

});


gulp.task('reload-concatfile',function(){

  concatfile = JSON.parse(fs.readFileSync('./concatfile.json'));

});


gulp.task('watch', ['concat'], function() {

  gulp.watch(['src/js/**/*.*'], ['js-concat']);
  gulp.watch(['src/css/**/*.*'], ['css-concat']);
  gulp.watch(['src/images/**/*.*'], imgDeps);
  gulp.watch(['src/html/**/*.*'], ['html']);

  gulp.watch('concatfile.json', ['reload-concatfile','concat']);

  gulp.start('browser-sync');
});


gulp.task('default', function() {
  gulp.start('watch');
});
