import gulp from 'gulp';
import co from 'co';
import path from 'path';
import plumber from 'gulp-plumber';
import rm from 'greasebox/rm';

import { paths } from './config';


gulp.task('clean', (cb) => {
  rm(paths.build)
  .then(cb)
  .catch(cb);
});
gulp.task('clean:server', (cb) => {
  rm(paths.serverBuild)
  .then(cb)
  .catch(cb);
});
