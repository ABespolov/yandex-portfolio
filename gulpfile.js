const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const htmlclean = require('gulp-htmlclean');
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const watch = require('gulp-watch');
const batch = require('gulp-batch');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function() {
    gulp.src(['app/styles/styles.scss'])
        .pipe(sourcemaps.init())
        //.pipe(concat('styles.css'))
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['ie >= 8', 'last 4 version'],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dev'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('images', () =>
    gulp.src('app/images/**')
    .pipe(imagemin([
        imageminMozjpeg({
            quality: 70
        }),
        imageminPngquant({
            speed: 1,
            quality: [0.7, 0.8]
        })
    ]))
    .pipe(gulp.dest('dev/images'))
    .pipe(browserSync.reload({
        stream: true
    }))
);

gulp.task('html', () =>
    gulp.src('app/index.html')
        .pipe(gulp.dest('dev'))
        .pipe(browserSync.reload({
            stream: true
        }))
);

gulp.task('browser-sync', () =>
    browserSync.init(null, {
        open: false,
        server: {
            baseDir: 'dev'
        }
    })
);

gulp.task('production', function() {
    gulp.start('sass');
    gulp.start('html');

    gulp.src(['dev/styles.css'])
        .pipe(cleanCSS({ level: 2 }))
        .pipe(gulp.dest('dist'));

    gulp.src(['dev/images/**/*'])
        .pipe(gulp.dest('dist/images'));

    gulp.src(['dev/index.html'])
        .pipe(htmlclean())
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    watch('app/**/*.scss', batch(function(events, done){
        gulp.start('sass', done);
    }));
    watch('app/**/*.html', batch(function(events, done){
        gulp.start('html', done);
    }));
    watch('app/images/**', batch(function(events, done){
        gulp.start('images', done);
    }));
});

gulp.task('default', ['watch', 'browser-sync']);