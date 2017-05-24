'use strict';

// Require gulp and plugins
const autoprefixer = require('autoprefixer');
const eslint = require('space-preconfigured-eslint');
const gulp = require('gulp');
const gulpPostCss = require('gulp-postcss');
const plumber = require('gulp-plumber');
const postcssDiscardDuplicates = require('postcss-discard-duplicates');
const postcssDiscardEmpty = require('postcss-discard-empty');
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
const postcssRoundSubpixels = require('postcss-round-subpixels');
const sass = require('gulp-sass');
const sourceMaps = require('gulp-sourcemaps');
const browsersync = require("browser-sync").create();

// Configuration
const supportedBrowsers = 'last 3 versions';

// Define file sources
const scssMain = ['scss/style.scss'];
const scssSources = ['scss/**/*.scss'];

// Production Styles w/o lint, source maps & with compression to optimize speed
gulp.task('scss-prod', function () {
  return gulp.src(scssMain)
    .pipe(plumber())
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'compressed',
    }))
    .pipe(gulpPostCss([
      autoprefixer({
        browsers: supportedBrowsers,
      }),
      postcssDiscardDuplicates,
      postcssDiscardEmpty,
      postcssRoundSubpixels,
      postcssFlexbugsFixes,
    ]))
    .pipe(plumber.stop())
    .pipe(gulp.dest('public/css'));
});

// Development styles with lint & sourcemaps
gulp.task('scss-dev', function () {
  return gulp.src(scssSources)
    .pipe(plumber())
    .pipe(sourceMaps.init())
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'compact',
    }))
    .pipe(gulpPostCss([
      autoprefixer({
        browsers: supportedBrowsers,
      }),
      postcssRoundSubpixels,
      postcssFlexbugsFixes,
    ]))
    .pipe(sourceMaps.write())
    .pipe(plumber.stop())
    .pipe(gulp.dest('public/css'));
});

// Watch SCSS files and compile using 'scss-dev' task
gulp.task('watch-scss', function () {
  gulp.watch(scssMain, ['scss-dev']);
  gulp.watch(scssSources, ['scss-dev']);
});

gulp.task("watch", function () {
  gulp.watch('./index.html');
});

gulp.task("serve", ["watch"], function () {
  browsersync.init({
    "server": {
      "baseDir": "./public"
    }
  });
  gulp.watch("./public/css/*.css").on("change", browsersync.reload);
  gulp.watch("./public/index.html").on("change", browsersync.reload);
});