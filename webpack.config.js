var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');


var isProduction = process.env.NODE_ENV === 'production',
    isTest = process.env.NODE_ENV === 'test',
    isDev = !isProduction && !isTest;

function getLocalIp() {
  var os = require('os');

  var interfaces = os.networkInterfaces();
  for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
      var address = interfaces[k][k2];
      if (address.family === 'IPv4' && !address.internal) {
        return address.address;
      }
    }
  }
  throw new Error('Local ip not determined');
}


// These define the entry points for webpack.
var entryPoints = {
  main: ['./frontend/index']
};

var output = {
  path: path.join(__dirname, './frontend/static/'),
  // This should match STATIC_URL in django
  publicPath: '/static/',
  filename: "[name].js"
};

var aliases = {}

if (isDev) {
  // In development use hot middleware to handle hot reloading
  // This overrides djangos STATIC_URL
  output.publicPath = `http://${getLocalIp()}:3000/assets/bundles/`;
  output.filename = "[name]-[hash].js";
  entryPoints.main = [
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://${getLocalIp()}:3000/`,
    'webpack/hot/only-dev-server',
    './frontend/index'
  ];
}


// These will be available in javascript and will be replaced with the value
// eg.
//   if (__DEVELOPMENT__) {}
//
// will become (in production)
//
//   if (false) {}
//
// And uglifyjs will do dead code removal on it
var globalDefines = {
  __DEVELOPMENT__: isDev,
  __DEVTOOLS__: isDev,
  'process.env': {
    'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }
}


//============================================================================
// Plugins
//     TODO http://mts.io/2015/04/08/webpack-shims-polyfills/
var plugins = [
  new webpack.DefinePlugin(globalDefines)
];
var loaders = [];
if (!isTest) {
  var filename = './' + (isProduction ? 'webpack-stats-prod.json' : 'webpack-stats.json');
  console.log(filename);
  plugins.push(
  // django reads the package generated here to workout what to include in
  // the template.
  new BundleTracker({filename: filename})
  );
}
// Development plugins
if (isDev) {
  plugins.push(
    // Hot code loading
    new webpack.HotModuleReplacementPlugin()
    // // Don't reload if there is an error
    // new webpack.NoErrorsPlugin()
  );
}
loaders.push('babel-loader');

// Production plugins
if (isProduction) {
  plugins.push(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        // Because uglify reports so many irrelevant warnings.
        warnings: false
      }
    })
  );
}

var svgoConfig = JSON.stringify({
  plugins: [
    {removeXMLProcInst: true},
    {removeTitle: true},
    {convertColors: {shorthex: false}},
    {convertPathData: false}
  ]
});

//============================================================================
var config = {
  // Cache to improve performance for multiple incremental builds
  cache: isDev || isTest,
  // Enable debug mode for all loaders
  debug: isDev || isTest,
  devtool: isDev ? '#eval-cheap-module-source-map' : '#source-map',
  entry: entryPoints,
  output: output,
  plugins: plugins,
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      }
    ],
    loaders: [
      {
        test: /\.(js|jsx)$/,
        // Don't process node_modules with this loader
        exclude: /node_modules/,
        loaders: loaders,
        include: [path.join(__dirname, 'frontend'), path.join(__dirname, 'test')]
      },
      // Inline images - use dataurl is <= 10kb otherwise use URL
      {
        loader: 'url-loader?limit=10000',
        test: /\.(gif|jpg|png)$/
      },
      // Allow requiring of json file
      {test: /\.json$/, loader: 'json-loader'},
      // Handle fonts
      {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff'},
      {test: /\.svg\?raw$/, loaders: ['raw-loader', 'svgo-loader?' + svgoConfig]},
      {test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader'},
    ]
  },
  resolve: {
    // Can import files with these extensions without specifying extension
    extensions: ['', '.js', '.jsx'],
    alias: aliases,
  }
};

if (isTest) {
  config.module.unknownContextCritical = false;
}

module.exports = config;
