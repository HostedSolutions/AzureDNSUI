/// <binding BeforeBuild='clean' AfterBuild='minify, scripts' ProjectOpened='watch' />
// include plug-ins
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');
var rename = require('gulp-rename');
var minifyCss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('watch', function () {
    return gulp.watch(config.AppJSsrc, ['scripts']);
});
gulp.task('default', function () {
});

//Define javascript files for processing
var config = {
    AppJSsrc: ['App/Scripts/**/*.js'],
    LibJSsrc: ['App/lib/**/*.min.js', '!App/lib/**/*.min.js.map',
        '!App/lib/**/*.min.js.gzip', , 'App/lib/**/ui-router-tabs.js',
        '!App/lib/**/jquery-1.8.2.min.js']
};

//delete the output file(s)
gulp.task('clean', function () {
    del(['App/scripts.min.js']);
    del(['App/lib.min.js']);
    return del(['Content/*.min.css']);
});


gulp.task('scripts', function () {
    // Process js from us
    gulp.src(config.AppJSsrc)
    .pipe(sourcemaps.init())
     .pipe(uglify())
     .pipe(concat('scripts.min.js'))
     .pipe(sourcemaps.write('maps'))
     .pipe(gulp.dest('App'));
    // Process js from 3rd parties
   gulp.src(config.LibJSsrc)
        .pipe(concat('lib.min.js'))
        .pipe(gulp.dest('App'));
});

gulp.task('minify', function () {
    gulp.src('./Content/*.css')
        .pipe(minifyCss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('Content/'));
});

//Set a default tasks
gulp.task('default', ['clean'], function () {
    gulp.start('minify', 'scripts');
});
