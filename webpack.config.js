const path = require("path");
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');

module.exports = {
  context: __dirname,

  entry: './teamwork/static/js/scrumboard/index.jsx',

  output: {
    path: path.resolve('assets/bundles/'),
    publicPath: '/static/bundles/',
    filename: "[name]-[hash].js",
  },

  plugins: [
    new BundleTracker({filename: './webpack-stats.json'}),
  ],
  module: {
    rules: [
      {
        test: /\.js?x/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ 'es2015', 'react', 'stage-2' ]
          }
        }
      }
    ]
  },
   // externals: require('react-native').getComponents()
  resolve: {
    extensions: ['.js', '.jsx'],
  }

};
