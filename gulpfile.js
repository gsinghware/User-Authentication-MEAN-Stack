var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var ejs = require('gulp-ejs');
var del = require('del');

var appDev = 'assets/';
var appProd = 'public/';
var vendor = 'public/js/vendor';

gulp.task('clean', function() {
   del(appProd + '/**/*');
});

gulp.task('build-js', function() {
    return gulp.src(appDev + '**/*.js')
                // .pipe(uglify())
                .pipe(gulp.dest(appProd)); 
});

gulp.task('build-sass', function() {
    return gulp.src(appDev + '**/*.scss')
                .pipe(sass())
                .pipe(gulp.dest(appProd));
});

gulp.task('build-ejs', function() {
    return gulp.src(appDev + '**/*.ejs')
                .pipe(ejs())
                .pipe(gulp.dest(appProd)); 
});

gulp.task('vendor', function() {
    // angular js
    gulp.src('node_modules/angular/**')
        .pipe(gulp.dest(vendor + '/angular/'));

    // angular route
    gulp.src('node_modules/angular-route/**')
        .pipe(gulp.dest(vendor + '/angular-route/'));
});

gulp.task('watch', function () {
    gulp.watch(appDev + '**/*.js', ['build-js']);
    gulp.watch(appDev + '**/*.ejs', ['build-ejs']); 
    gulp.watch(appDev + '**/*.scss', ['build-sass']); 
});

gulp.task('default', ['build-js', 'build-sass', 'build-ejs', 'watch', 'vendor']);