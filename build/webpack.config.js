const path = require('path')
const paths = require('../config/paths')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ExtratTextWebpackPlugin = require('extract-text-webpack-plugin')
const vueLoaderPlugin = require('vue-loader/lib/plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const HappyPack = require('happypack')
const os = require('os')

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

const imgReg = /\.(jpe?g|png|gif)$/i
const mediaReg = /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/
const fontReg = /\.(woff2?|eot|ttf|otf)(\?.*)?$/i

module.exports = env => {
  const DEV_MODE = env === 'development'
  return {
    entry: {
      index: [paths.resolvePath('index.js')]
    },
    output: {
      path: paths.resolvePath('dist'),
      filename: 'js/[name].[hash:8].js'
    },
    module: {
      noParse: /jquery|lodash/,
      rules: [
        {
          test: /\.vue$/,
          use: ['cache-loader', {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false
              }
            }
          }],
          exclude: '/node_modules/'
        }, {
          test: /\.(le|c)ss$/,
          use: [
            {
              loader: DEV_MODE ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
              options: {
                hmr: DEV_MODE
              }
            }
            ,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: [require('autoprefixer')]
              }
            }, 'less-loader'
          ],
          exclude: '/node_modules/'
        }, {
          test: imgReg, // 图片文件
          use: ['cache-loader',
            {
              loader: 'url-loader',
              options: {
                limit: 10240, // 小于limit的文件将会转为base64
                fallback: {
                  loader: 'file-loader',
                  options: {
                    name: 'img/[name].[hash:8].[ext]'
                  }
                }
              }
            }
          ]
        }, {
          test: /\.js$/,
          use: {
            loader: 'happypack/loader?id=happyBabel',
          },
          exclude: '/node_modules/'
        }
      ]
    },
    resolve: {
      alias: { // 路径别名,直接告诉webpack去哪找文件，节省时间
        'vue$': 'vue/dist/vue.runtime.esm.js',
        '@': paths.src,
        'assets': paths.assets
      },
      extensions: ['*', '.js', '.json', '.vue'] // 自动解析确定的扩展，导入文件时可以不带扩展
    },
    plugins: [  
      new CleanWebpackPlugin(),
      new webpack.DllReferencePlugin({
        manifest: require('./vendor-manifest.json')
      }), 
      new CopyWebpackPlugin([{
        from: 'static', to: 'static' // copy生成的vendor文件到{output}目录中
      }]),
      new HtmlWebpackPlugin({
        template: paths.resolvePath('index.html')
      }),
      new vueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: DEV_MODE ? 'css/[name].css' : 'css/[name].[hash:8].css',
        chunkFilename: DEV_MODE ? 'css/[id].css' : 'css/[id].[hash:8].css'
      }),
      new HappyPack({
        id: 'happyBabel',
        threadPool: happyThreadPool,
        loaders: ['cache-loader',
        {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'], // modules: false  开启tree-shaking时使用
            cacheDirectory: true
          }
        }],
      }),
    
      /**
       * happypack 和 miniExtractCssPlugin不兼容，和 postcss-loader 一起也会报错
       */
      // new HappyPack({
      //   id: 'happyCss',
      //   threadPool: happyThreadPool,
      //   loaders: [
      //     'css-loader',
      //     'less-loader'
      //   ]
      // })
    ],
    externals: {
      jquery: 'jQuery' // 使用cdn的jquery
    }
  }
}