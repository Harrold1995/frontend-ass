const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const gulpIf = require('gulp-if');
const merge = require('merge-stream');
const rename = require('gulp-rename');

const isProd = process.env.NODE_ENV === 'production';

/**
 * Compile SCSS → CSS, then MERGE with plain CSS (src/css/style.css),
 * and emit a single dist/css/main.css (+ sourcemap).
 */
function styles() {
  // 1) compile SCSS
  const scssStream = src('src/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ includePaths: ['node_modules'] }).on('error', sass.logError))
    .pipe(postcss([autoprefixer(), ...(isProd ? [cssnano()] : [])]))
    .pipe(rename('scss.css')); // temporary name for merging

  // 2) raw CSS (your custom styles)
  const cssStream = src('src/css/style.css');

  // 3) merge -> concat -> write
  return merge(scssStream, cssStream)
    .pipe(concat('main.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream());
}

function scripts() {
  return src([
    'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
    'src/js/main.js',
  ])
    .pipe(concat('bundle.js'))
    .pipe(gulpIf(isProd, uglify()))
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream());
}

function html() {
  return src('src/index.html')
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

function serve() {
  browserSync.init({ server: { baseDir: 'dist' }, open: false });
  watch('src/scss/**/*.scss', styles);
  watch('src/css/**/*.css', styles);     // <-- watch raw CSS too
  watch('src/js/**/*.js', scripts);
  watch('src/**/*.html', html);
}

exports.build = series(parallel(styles, scripts, html));
exports.default = series(parallel(styles, scripts, html), serve);
