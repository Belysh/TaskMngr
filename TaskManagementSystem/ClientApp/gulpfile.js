const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const concat = require('gulp-concat');

const paths = {
    root: './src',
    styles: {
        src: 'src/styles/**/*.scss',
        dest: 'src/'
    }
};

function styles() {
    return gulp.src('./src/styles/**/*.scss')
        .pipe(concat('main.css'))
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(sourcemaps.write())        
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.styles.dest))       
}

function watch() {
    gulp.watch(paths.styles.src, styles);
}

exports.styles = styles;

gulp.task('default', gulp.series(
    gulp.parallel(watch, styles)
));