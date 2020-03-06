const webpack = require('webpack')
const webpackConfig = require('./webpack.config')
const webpackMerge = require('webpack-merge')
const paths = require('../config/paths')

module.exports = webpackMerge(webpackConfig('development'), {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    port: '3000',
    hot: true,
    contentBase: paths.dist
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
})