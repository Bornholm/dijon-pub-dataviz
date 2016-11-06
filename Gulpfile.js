const usemin = require('gulp-usemin');
const uglify = require('gulp-uglify');
const minifyHtml = require('gulp-minify-html');
const minifyCss = require('gulp-minify-css');
const gulp = require('gulp');
const del = require('del');

gulp.task('clean', () => del(['docs/*']));

gulp.task('build', () => {
  return gulp.src('./*.html')
    .pipe(usemin({
      css: [ minifyCss() ],
      html: [ minifyHtml({ empty: true }) ],
      js: [ uglify() ],
      inlinejs: [ uglify() ],
      inlinecss: [ minifyCss(), 'concat' ]
    }))
    .pipe(gulp.dest('docs/'));
});

gulp.task('default', ['clean', 'build'])
