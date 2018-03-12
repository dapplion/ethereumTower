var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var extractPlugin = new ExtractTextPlugin({
   filename: 'main.css'
});
// This is a js file, import first then export.

// This is a javascript object, know the syntax (comas, arrays, etc)
module.exports = {
  // Where webpack starts analyzing the project (relative path from the config)
  // You can have multiple entry points
  entry: './src/js/app.js',
  output: {
    // The path module helps you write absolute paths easier
    path: path.resolve(__dirname, 'dist'),
    filename:  'bundle.js',
  },
  // resolve module
  resolve: {
    alias: {
      EventBusAlias$: path.resolve(__dirname, 'src', 'js', 'components', 'event-bus.js'),
      Store$: path.resolve(__dirname, 'src', 'js', 'stores', 'AppStore.js'),
      Action$: path.resolve(__dirname, 'src', 'js', 'actions', 'AppActions.js'),
      Params$: path.resolve(__dirname, 'src', 'js', 'params.js'),
      Lib: path.resolve(__dirname, 'src', 'js', 'lib'),
      Audio: path.resolve(__dirname, 'src', 'audio'),
      Img: path.resolve(__dirname, 'src', 'img'),
    },
  },
  // Modules are applied to single files before bundling
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties'],
        }
      },
      {
        // If you find a file with extension .css, do this
        test: /\.scss$/,
        // Just running the use, it will add the css in the bundle.js
        // If you want to decouple js / scss do this following approach
        use: extractPlugin.extract({
          // This is just a pattern for this particular pattern (learn docs)
          // This array is run in reverse order
          use: ['css-loader', 'sass-loader']
        })
        // use: [
        //   // Webpack will use the loaders in reverse order
        //   'style-loader', // This auto-adds the style.css in the top of the html
        //   'css-loader' // This lets you import css in js
        // ]
      },
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      {
        // Use this loader for both jpg and png
        test: /\.(jpg|png)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              // Dont't let file-loader use hashes (Personal opinion)
              name: '[name].[ext]',
              // Store the images in a separate folder (Personal opinion)
              outputPath: 'img/',
              // Put img/imageName in the html reference in the index.html
              publicPath: ''
            }
          }
        ]
      }
    ]
  },
  // Plugins are applied to the bundled code before exporting
  // f.e. a minifier (but webpack already does that)
  plugins: [

    new webpack.ProvidePlugin({
      _: 'lodash',
      Pubsub: 'pubsub-js'
    }),
    // Always instiate (new) plugins and import them
    // You can do both at the beggining and then reference the var
    extractPlugin,
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    // This will clean the dist folder before building, so all files are fresh and new
    new CleanWebpackPlugin(['dist'])
  ]
}
