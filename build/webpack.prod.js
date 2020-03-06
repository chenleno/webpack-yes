const webpack = require('webpack')
const webpackConfig = require('./webpack.config')
const webpackMerge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const paths = require('../config/paths')
const path = require('path')
const parallelUglifyPlugin = require('webpack-parallel-uglify-plugin')

module.exports = webpackMerge(webpackConfig('production'), {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  plugins: [
    /**
     * copy-webpack-plugin to的默认值为{output}
     */
    new CopyWebpackPlugin([{
      from: 'index.html',
    }]),
    new webpack.DllReferencePlugin({
      manifest: require('./vendor-manifest.json')
    }), 
    new CopyWebpackPlugin([{
      from: 'static', to: 'static' // copy生成的vendor文件到{output}目录中
    }])
  ],
  optimization: {
    minimizer: [
      new parallelUglifyPlugin({
        cacheDir: '.cache/',
        uglifyJS: {
          output: {
            comments: false,
            beautify: false
          },
          compress: {
            drop_console: true,
            collapse_vars: true,
            reduce_vars: true
          }
        }
      }),
      // new UglifyJsPlugin({
      //   cache: true,
      //   parallel: true,
      //   sourceMap: true
      // }),

      new OptimizeCssAssetsPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial' // 只打包初始时依赖的第三方
        }
      }
    }
  }
})


