import gulp from 'gulp';
import co from 'co';
import path from 'path';
import plumber from 'gulp-plumber';
import * as gb from 'greasebox';
import * as config from './config';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';

const jsFiles = `${config.paths.source}/**/*.js`;
const copyFiles = [`${config.paths.source}/**`, `!${jsFiles}`];

const serverJsFiles = `${config.paths.serverSource}/**/*.js`;
const serverCopyFiles = [`${config.paths.serverSource}/**`, `!${serverJsFiles}`];

gulp.task('build', ['build:js', 'build:copy'], () => {});
gulp.task('build:server', ['build:server:js', 'build:server:copy'], () => {});

gulp.task('build:js', ['clean'], (cb) => {
  gulp.src(jsFiles)
    .pipe(plumber({
      errorHanlder: cb
    }))
    .pipe(sourcemaps.init())
    .pipe(babel(config.babelOptions))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.paths.build))
    .on('end', cb);
});

gulp.task('build:server:js', ['clean:server', 'build'], (cb) => {
  gulp.src(serverJsFiles)
    .pipe(plumber({
      errorHanlder: cb
    }))
    .pipe(sourcemaps.init())
    .pipe(babel(config.babelOptions))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.paths.serverBuild))
    .on('end', cb);
});

//mainly configs in json format
gulp.task('build:copy', ['clean'], (cb) => {
  gulp.src(copyFiles)
    .pipe(plumber({
      errorHanlder: cb
    }))
    .pipe(gulp.dest(config.paths.build))
    .on('end', cb);
});

gulp.task('build:server:copy', ['clean:server'], (cb) => {
  gulp.src(copyFiles)
    .pipe(plumber({
      errorHanlder: cb
    }))
    .pipe(gulp.dest(config.paths.serverBuild))
    .on('end', cb);
});

