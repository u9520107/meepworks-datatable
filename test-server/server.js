import koa from 'koa';
import favicon from 'koa-favicon';
import mount from 'koa-mount';
import serve from 'koa-static-cache';
import * as config from './config';

import path from 'path';


import RequireFilter from 'meepworks/require-filter';
const requireFilter = new RequireFilter({
  baseURL: '',
  root: path.resolve(__dirname, '..')
  //version: version
});
requireFilter.filter('.css!');

import AppDriver from 'meepworks/server-app-driver';

const port = process.env.PORT || 13382;
const server = koa();

const cacheTime = 5*60*1000;

server.use(favicon());

server.use(mount('/jspm_packages', serve(path.resolve(__dirname, '../jspm_packages'), {
})));
server.use(mount('/test-server-build', serve(path.resolve(__dirname, '../test-server-build'), {
})));
server.use(mount('/build', serve(path.resolve(__dirname, '../build'), {
})));

server.use(function*(next) {
  console.log(this.req.url);
  yield next;
});

const app = new AppDriver({
  appPath: 'app/app',
  jspm: {
    path: 'jspm_packages',
    config: 'jspm_packages/config.js'
  },
  dirname: __dirname,
  root: path.resolve(__dirname, '..'),
  buildPath: '/test-server-build',
  buildURL: 'test-server-build',
  abortPath: '/',
  baseURL: ''
});
server.use(app.router);

server.listen(port, () => {
  console.log(`listening to ${port}`);
});

