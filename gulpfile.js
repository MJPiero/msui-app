/**
 * Created by majing on 2016/3/24.
 */
var gulp = require("gulp"),
    compass = require('gulp-compass'),
    concat = require('gulp-concat'),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename"),
    del = require("del"),
    template = require("gulp-template"),
    runSequence = require('run-sequence');

// 清理文件
gulp.task('clean', function (cb) {
    return del([
        './build/**'
    ],cb)
});

gulp.task('copy:img',function () {
    return gulp.src(['./images/*'])
        .pipe(gulp.dest('./build/images/'))

});

gulp.task('copy:font',function () {
    return gulp.src(['./bower_components/font-awesome/fonts/*'])
        .pipe(gulp.dest('./build/fonts/'))

});


// compass调用
gulp.task('compass', function() {
    return gulp.src([
        './sass/!default.scss',
        './sass/*.scss'
    ])
        .pipe(compass({
            config_file: './config.rb',
            css: './css',
            sass: './sass'
        }))
});

//压缩合并css
gulp.task('build:css',['compass'],function () {
    return gulp.src([
        './css/sm.min.css',
        './bower_components/Swiper/dist/css/swiper.min.css',
        './bower_components/font-awesome/css/font-awesome.min.css',
        './css/index.css'
    ])
        .pipe(concat('app.css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifyCss())
        .pipe(gulp.dest('./build/css'))
});

gulp.task('copy:js',function () {
   return gulp.src(['./js/main.js'])
       .pipe(gulp.dest('./build/js/'))

});

gulp.task('build:js', ['copy:js'],function () {
    return gulp.src([
            './bower_components/zepto/zepto.min.js',
            './bower_components/Swiper/dist/js/swiper.min.js',
            './js/sm.min.js',
            './js/component/*.js'
        ])
        .pipe(concat('app.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js/'))
});

//开启监控
gulp.task('watch',function () {
    gulp.watch([
        './sass/*.scss'
    ], ['build:css']);
    gulp.watch([
        './js/**/*.js'
    ], ['build:js']);
})

//开发模式
gulp.task('default',function () {
    runSequence('clean',
        ['copy:img','copy:font','build:css','build:js','watch'],
        function () {
            console.log('开发模式');
        });
});

//发布
gulp.task('dev',function () {
    runSequence('clean',
        ['copy:img','copy:font','build:css','build:js'],
        function () {
            console.log('打包完成');
        });
});