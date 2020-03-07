# webpack
## 核心四个概念
- 入口 entry (指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始)
- 输出 output (告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件)
- loader (让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）。loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理。)
loader 解析遵循 **从右向左** 原则
```javascript
// index.jsx
import './index.less' // 在js中直接import less 文件便是webpack的能力
```
- 插件 plugin (插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。)
## 其他模块
- resolve 设置模块如何被解析
  + alias 路径别名,直接告诉webpack去哪找文件，节省时间
  + extensions 自动解析确定的扩展，导入文件时就可以不用带扩展了,优先级高的格式写前面
- optimization 解析优化
  + minimize 
  + minimizer // 使用压缩工具覆盖默认压缩
  + splitChunks // 代码分块策略
- externals // 使用cdn等库时的配置
## 常用loader
- style-loader, css-loader, postcss-loader, less-loader... // 样式解析loader
- file-loader, url-loader // 文件处理loader
- bable-loader // js转译loader
  + babel/polyfill // 放在入口文件最上面，它运行于所有脚本文件之前

## 常用plugin
- html-webpack-plugin // 将打包后的js文件自动导入到目标html中
- clean-webpack-plugin // 每次打包前清除之前的打包文件
- mini-css-extract-plugin // 打包后拆分js 和 css
- webpack-dev-server // 热更新模块
- webpack-merge // 合并配置
- copy-webpack-plugin // 拷贝静态资源
- optimize-css-assets-webpack-plugin // 压缩css
- uglifyjs-webpack-plugin // 压缩js

## VUE 相关
- vue-loader // 解析vue文件
- vue-template-compiler // 用于编译模板

## 优化相关
- happypack // 将解析loader的工作分发给每一个进程，执行完后再汇总
- webpack-parallel-uglify-plugin // 优化代码压缩时间 （和happypack功能类似）
- webpack.DllPlugin // 抽取第三方模块
- cache-loader // 用于缓存编译文件内容
- webpack-bundle-analyzer // 生成打包分析图

## loader 编写原则
- 单一原则: 每个 Loader 只做一件事；
- 链式调用: Webpack 会按顺序链式调用每个 Loader；
- 统一原则: 遵循 Webpack 制定的设计规则和结构，输入与输出均为字符串，各个 Loader 完全独立，即插即用；


## 配置示例
```javascript
const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const vueLoaderPlugin = require('vue-loader/lib/plugin')
const HappyPack = require('happypack')
const os = require('os')
const WebpackAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// 开辟一个线程池
// 拿到系统CPU的最大核数，happypack 将编译工作灌满所有进程
const happyPackThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

{
  entry: ['babel/polyfill', ...],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].[hash:8].js'
  }
  ...,
  module: {
    noParse: /jquery|lodash/ // 不解析模块
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: ['cache-loader',
          MiniCssExtractPlugin.loader, // mini-css-extract-plugin loader 和 style-loader 冲突，故只保留一个
          'css-loader', 'less-loader'
        ]
      }, {
        test: /\.(jpe?g|png|gif)$/i,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10240,
            fallback: {
              loader: 'file-loader',
              options: {
                name: 'img/[name].[hash:8].[ext]'
              }
            }
          }
        }]
      }, {
        test: /\.js$/,
        use: {
          loader: 'happypack/loader?id=happyJs'
        }
      }
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src')
    },
    extensions: ['.js', '.vue']
  },
  devServer: {
    port: '3000',
    hot: true,
    contentBase: '../dist'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash:8].css', // 分离的css 文件名
    }),
    new vueLoaderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HappyPack({
      id: 'happyJs',
      threadPool: happyPackThreadPool,
      loaders: [...]
    }),
    new WebpackAnalyzerPlugin({
      analyzerHost: '127.0.0.1',
      analyzerPort: 8899
    })
  ],
  optimization: {
    minimizer: [
      new UglifyPlugin(...)
    ]
  },
  externals: {
    'jquery': 'jQuery'
  }
}
```