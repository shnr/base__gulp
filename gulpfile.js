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
function html() {
  return gulp.src(src.watch_html)
    .pipe(browser.reload({stream:true}))
}



/*
 * sass
 */
function styles() {
  return gulp.src(src.sass)
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}))
    // .pipe(sass({outputStyle: 'expended'})) // 開発用
    .pipe(autoprefixer())
    .pipe(gulp.dest(dest.root + DEST_DIR + 'css/'))
    .pipe(browser.reload({stream:true}))
}



/**
 * js
 */
function scripts() {
  return gulp.src(src.js)
  // .pipe(gulp.dest(dest.root + 'js/'))
  .pipe(browser.reload({stream: true}));
}



/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;




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
  gulp.watch(src.sass, styles);
  gulp.watch(src.watch_html, html);
  gulp.watch(src.js, scripts);
});


// gulp v4へのアップデートによる記述の違い
// https://satoyan419.com/gulp-v4/
// gulp.task('default', ['watch','server']);
gulp.task('default', gulp.series( gulp.parallel('watch', 'server'), function(){
    // タスクの記述
}));

