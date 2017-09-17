var browserSync = require('browser-sync'),
    del = require('del'),
    gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    cache = require('gulp-cache'),
    cssnano = require('gulp-cssnano'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    pngquant = require('imagemin-pngquant'),
    sass = require('gulp-sass'),
    notify = require('gulp-notify'),
    rigger = require('gulp-rigger'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    postcss = require('gulp-postcss'),
    mqpacker = require('css-mqpacker');

gulp.task('sass', function() {
  return gulp.src('app/sass/style.sass')
  .pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
  .pipe(autoprefixer(['last 15 versions', '>1%', 'ie 8', 'ie 7'], {cascade: true}))
  // .pipe(postcss([mqpacker()]))
  // .pipe(cssnano())
  // .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.reload({stream: true}))
});

gulp.task('html', function() {
	return gulp.src('app/templates/index.html')
	.pipe(rigger())
	.pipe(gulp.dest('app'))
	.pipe(browserSync.reload({stream : true}))
});

  // Not use because libs css @import

// gulp.task('css-libs', ['sass'], function() {
//  return gulp.src('app/css/libs/**/*.css')
//   .pipe(cssnano())
//   .pipe(rename({suffix: '.min'}))
//   .pipe(gulp.dest('app/css'));
// });

// gulp.task('common-js', function() {
// 	return gulp.src([
// 		'app/js/common.js',
// 		])
// 	.pipe(concat('common.min.js'))
// 	.pipe(uglify())
// 	.pipe(gulp.dest('app/js'));
// });

// gulp.task('js', ['common-js'], function() {
// 	return gulp.src([
// 		'app/libs/jquery/jquery-3.2.1.min.js',
// 		'app/js/common.min.js', // Всегда в конце
// 		])
// 	.pipe(concat('scripts.min.js'))
// 	// .pipe(uglify()) // Минимизировать весь js (на выбор)
// 	.pipe(gulp.dest('app/js'))
// 	.pipe(browserSync.reload({stream: true}));
// });


gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false
  });
});

gulp.task('cleanDocs', function() {
  return del.sync('docs');
});

gulp.task('clearCache', function() {
  return cache.clearALL();
});

gulp.task('img', function() {
  return gulp.src('app/img/**/*')
  .pipe(cache(imagemin({
    interlaced: true,
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  })))
  .pipe(gulp.dest('docs/img'));
});

gulp.task('watch', ['html', 'sass', 'browser-sync'], function() {
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch('app/templates/**/*.html', ['html']);
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], browserSync.reload);
	gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('build', ['cleanDocs', 'img', 'sass'], function() {
  var buildCss = gulp.src('app/css/style.css')
  .pipe(gulp.dest('docs/css'));

  var buildFonts = gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('docs/fonts'));

  var buildHtml = gulp.src('app/*.html')
  .pipe(gulp.dest('docs'));

  var buildJs = gulp.src('app/js/**/*.js')
  .pipe(gulp.dest('docs/js'));

  var buildJs = gulp.src('app/libs/**/*')
  .pipe(gulp.dest('docs/libs'));
});

gulp.task('default', ['watch']);
