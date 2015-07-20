import gulp from 'gulp';


export const paths =  {
  source: 'source',
  build: 'build',
  serverSource: 'test-server',
  serverBuild: 'test-server-build'

};

export const babelOptions = {
  modules: 'common',
  optional: ['runtime'],
  stage: 0
};


gulp.task('config', ()=>{
  console.log(JSON.stringify({
    paths,
    babelOptions
  }, null, 2));
});
