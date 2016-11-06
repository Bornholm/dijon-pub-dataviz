const usemin = require('gulp-usemin');
const uglify = require('gulp-uglify');
const minifyHtml = require('gulp-minify-html');
const minifyCss = require('gulp-minify-css');
const rev = require('gulp-rev');
const gulp = require('gulp');

gulp.task('default', () => {
  return gulp.src('./*.html')
    .pipe(usemin({
      css: [ rev() ],
      html: [ minifyHtml({ empty: true }) ],
      js: [ uglify(), rev() ],
      inlinejs: [ uglify() ],
      inlinecss: [ minifyCss(), 'concat' ]
    }))
    .pipe(gulp.dest('docs/'));
});
