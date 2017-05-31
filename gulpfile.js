var gulp = require('gulp');
    notify = require("gulp-notify");
    sass = require('gulp-sass');
    autoprefixer = require('gulp-autoprefixer');
    csso = require('gulp-csso');
    concat = require('gulp-concat');
    uglify = require('gulp-uglify');
    rename = require("gulp-rename");
    imagemin = require('gulp-imagemin');
    cache = require('gulp-cache');
    clean = require('gulp-dest-clean');
    cache = require('gulp-cache');
    browserSync = require('browser-sync').create();
    gulpSequence = require('gulp-sequence');


//Compile sass
gulp.task('styles', function () {
  return gulp.src('./dev/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 4 versions']}))
    .pipe(gulp.dest('./prod/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(csso())
    .pipe(gulp.dest('./prod/css'))
    .pipe(notify({ message: 'Styles task complete' }))
    // .pipe(browserSync.stream());
}); 

// JS
gulp.task('scripts', function() {
  return gulp.src(['./dev/js/*.js'])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./prod/js/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('./prod/js/'))
    .pipe(notify({ message: 'Scripts task complete' }))
    // .pipe(browserSync.stream());
});

// Min Images
gulp.task('images', () =>
    gulp.src('./dev/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./prod/img'))
        .pipe(notify({ message: 'Scripts task complete' }))
);

// Fonts to prod
gulp.task('fonts', function() {
    gulp.src('./dev/fonts/*.*')
    .pipe(gulp.dest('./prod/fonts/'));
});

// Clean
gulp.task('clean', function() {
 return gulp.src('./dev')
 	.pipe(clean('./prod'));
});

// Static Server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

// Build
gulp.task('build', gulpSequence('clean', 'fonts', 'images', 'styles', 'scripts', 'browser-sync'));

// Watcher
gulp.task('watch', function() {
	browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('./dev/sass/main.scss', ['styles', browserSync.reload]);
    gulp.watch('./dev/js/main.js', ['scripts', browserSync.reload]);
    gulp.watch("*.html").on("change", browserSync.reload);
});