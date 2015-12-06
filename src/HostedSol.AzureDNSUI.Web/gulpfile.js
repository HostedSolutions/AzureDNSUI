/// <binding BeforeBuild='clean' AfterBuild='minify, scripts' />
// include plug-ins
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');
var rename = require('gulp-rename');
var minifyCss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('default', function () {
});

var config = {
    //Include all js files but exclude any min.js files
    AppJSsrc: ['App/Scripts/**/*.js'],
    LibJSsrc: ['App/lib/**/*.min.js', '!App/lib/**/*.min.js.map',
        '!App/lib/**/*.min.js.gzip', , 'App/lib/**/ui-router-tabs.js',
        '!App/lib/**/jquery-1.8.2.min.js']
};//, '!App/lib/**/angular.min.js'

//delete the output file(s)
gulp.task('clean', function () {
    //del is an async function and not a gulp plugin (just standard nodejs)
    //It returns a promise, so make sure you return that from this task function
    //  so gulp knows when the delete is complete
    del(['App/scripts.min.js']);
    del(['App/lib.min.js']);
    return del(['Content/*.min.css']);
});

// Combine and minify all files from the app folder
// This tasks depends on the clean task which means gulp will ensure that the 
// Clean task is completed before running the scripts task.
gulp.task('scripts', function () {
    gulp.src(config.AppJSsrc)
    .pipe(sourcemaps.init())
     .pipe(uglify())
     .pipe(concat('scripts.min.js'))
     .pipe(sourcemaps.write('maps'))
     .pipe(gulp.dest('App'));

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
    // do nothing  
});
