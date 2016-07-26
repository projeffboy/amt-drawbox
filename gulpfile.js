/* Modules */
var pug = require('gulp-pug');
var prettify = require('gulp-prettify');
var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var beautify = require('gulp-beautify');
var uglify = require('gulp-uglify');

function addMin(path) {
    path.basename += '.min';
}

/* HTML */
// Converts Jade to HTML
gulp.task('pug', function() {
    return gulp.src('index.jade')
        .pipe(pug())
        .pipe(prettify({
            indent_size: 4
        }))
        .pipe(gulp.dest('../drawbox'));
});

/* CSS */
// Converts SCSS to CSS
gulp.task('css', function() {
    gulp.src('css/style.scss')
        .pipe(sass({
            outputStyle: 'expanded',
            indentWidth: 4
        }))
        .pipe(gulp.dest('css'));
    gulp.src('css/*.css')
        .pipe(cleanCSS())
        .pipe(rename(addMin))
        .pipe(gulp.dest('min-css'));
});

/* JS */
// Beautifies JS
gulp.task('beautify', function() {
    gulp.src('js/*.js')
        .pipe(beautify())
        .pipe(gulp.dest('js'));
    gulp.src('gulpfile.js')
        .pipe(beautify())
        .pipe(gulp.dest('../drawbox'));
});
// Minifies JS
gulp.task('uglify', function() {
    gulp.src('js/*.js')
        .pipe(uglify())
        .pipe(rename(addMin))
        .pipe(gulp.dest('min-js'));
});
// Does all JS-related tasks
gulp.task('js', ['beautify', 'uglify']);

/* General */
// Does all tasks
gulp.task('everything', ['pug', 'css', 'js']);
