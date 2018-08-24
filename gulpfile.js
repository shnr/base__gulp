'use strict';

var gulp = require('gulp');
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var plumber = require('gulp-plumber');
var notify  = require('gulp-notify');
var browser = require("browser-sync");
var concat = require("gulp-concat");
var sourcemaps = require ('gulp-sourcemaps');
require('es6-promise').polyfill();


/**
 * 開発用のディレクトリを指定します。
 */
var src = {
  'watch_html': 'src/**/*.html',
  'js': 'src/**/*.js',
  'css': 'src/**/*.css',
  'sass': 'src/_sass/sass/**/*.scss'
};


/**
 * 出力するディレクトリを指定します。
 */
var dest = {
  'root': 'src/',
  'html': 'src/'
};


var DEST_DIR = './assets/';


/*
 * html task
 */
gulp.task('html', function () {
  gulp.src([src.watch_html])
    .pipe(browser.reload({stream:true}))
});



/*
 * sass
 */
gulp.task('sass',function(){
      gulp.src([src.sass])
      .pipe(plumber({
        errorHandler: notify.onError('Error: <%= error.message %>')
      }))
      .pipe(sourcemaps.init())
      .pipe(sass({outputStyle: 'compressed'}))
      // .pipe(sass({outputStyle: 'expended'})) // 開発用
      .pipe(autoprefixer())
      // .pipe(sourcemaps.write()) // 開発用
      .pipe(gulp.dest(dest.root + DEST_DIR + 'css/'))
      .pipe(browser.reload({stream:true}))
});



/**
 * jsファイルをdestディレクトリに出力（コピー）します。
 */
gulp.task('js', function() {
  return gulp.src(src.js, {base: src.root})
  .pipe(gulp.dest(dest.root + 'js/'))
  .pipe(browser.reload({stream: true}));
});


/*
 * Run server 
 */
gulp.task("server", function() {
  browser({
    server: {
      baseDir: dest.root,
      index: "index.html"
    }
  });
});



/*
 * Watch
 */
gulp.task('watch',function(){
  gulp.watch(src.sass, function(event){
    gulp.run('sass');
  });
  gulp.watch(src.watch_html, function(event){
    gulp.run('html');
  });
  gulp.watch(src.js, function(event){
    gulp.run('js');
  });
});


// gulp v4へのアップデートによる記述の違い
// https://satoyan419.com/gulp-v4/
// gulp.task('default', ['watch','server']);
gulp.task('default', gulp.series( gulp.parallel('watch', 'server'), function(){
    // タスクの記述
}));

