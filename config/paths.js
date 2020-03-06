const path = require('path')

const rootPath = path.resolve(__dirname, '../')
const resolvePath = appPath => path.resolve(rootPath, appPath)

module.exports = {
  resolvePath,
  root: rootPath,
  config: resolvePath('config'),
  build: resolvePath('build'),
  dist: resolvePath('dist'),
  src: resolvePath('src'),
  assets: resolvePath('assets'),
  static: resolvePath('static')
}
