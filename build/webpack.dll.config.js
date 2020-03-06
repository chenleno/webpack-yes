const path = require('path')
const paths = require('../config/paths')
const webpack = require('webpack')

module.exports = {
  entry: {
    vendor: ['vue', 'lodash']
  },
  output: {
    path: path.resolve(paths.root, 'static/js'),
    filename: '[name].dll.js',
    library: '[name]_library'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(__dirname, '[name]-manifest.json'),
      name: '[name]_library',
    })
  ]
}
