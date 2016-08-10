var webpack = require('webpack');
var config = require('../webpack.config');
// Bail on first error when building
config.bail = true;
var compiler = webpack(config);

console.log('Building for '+process.env.NODE_ENV);

compiler.run(function(err, stats) {
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
