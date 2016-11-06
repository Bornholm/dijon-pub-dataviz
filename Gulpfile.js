const usemin = require('gulp-usemin');
const uglify = require('gulp-uglify');
const minifyHtml = require('gulp-minify-html');
const minifyCss = require('gulp-minify-css');
const gulp = require('gulp');
const del = require('del');
const runSequence = require('run-sequence');

gulp.task('docs:clean', () => del(['docs/*']));

gulp.task('resources:copy', () => {
  return gulp.src('bower_components/leaflet/dist/images/*')
    .pipe(gulp.dest('docs/images'))
  ;
});

gulp.task('html:compress', () => {
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

gulp.task('build', cb => runSequence('docs:clean', ['resources:copy', 'html:compress'], cb))

gulp.task('default', ['build'])
