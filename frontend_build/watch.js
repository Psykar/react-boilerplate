var webpack = require('webpack');
var config = require('../webpack.config');
var compiler = webpack(config);

compiler.watch({}, function(err, stats) {
  if (err) { throw err; }
  console.log(stats.toString({
    colors: true,
    version: false,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false
  }));
});
