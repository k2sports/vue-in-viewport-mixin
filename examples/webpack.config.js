const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

module.exports = {

  devtool: 'inline-source-map',

  entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
    const fullDir = path.join(__dirname, dir)
    const entry = path.join(fullDir, 'app.coffee')
    if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
      entries[dir] = entry
    }

    return entries
  }, {}),

  output: {
    path: path.join(__dirname, '__build__'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/__build__/'
  },

  module: {
    loaders: [
      { test: /\.vue$/, loader: 'vue' },
      { test: /\.coffee$/, loader: 'coffee-loader' }
    ]
  },

  resolve: {
    alias: {
      'vue': 'vue/dist/vue.js',
      'vue-in-viewport-mixin': path.join(__dirname, '..', 'index.coffee')
    }
  },

  // Expose __dirname to allow automatically setting basename.
  context: __dirname,
  node: {
    __dirname: true
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('shared.js'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]

}
