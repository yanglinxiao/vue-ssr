const path = require('path');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals')
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const commonConfig = require('./webpack.common');

const config = merge(commonConfig, {
  entry: {
    server: path.resolve(__dirname, '../src/entry-server.js')
  },
  target: 'node',
  output: {
    libraryTarget: 'commonjs2'
  },
  // https://webpack.js.org/configuration/externals/#function
  // https://github.com/liady/webpack-node-externals
  // 外置化应用程序依赖模块。可以使服务器构建速度更快，
  // 并生成较小的 bundle 文件。
  externals: nodeExternals({
    // 不要外置化 webpack 需要处理的依赖模块。
    // 你可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件，
    // 你还应该将修改 `global`（例如 polyfill）的依赖模块列入白名单
    // whitelist: /\.css$/
  }),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: 'null-loader'
      }
    ]
  },
  plugins: [
    // 这是将服务器的整个输出
    // 构建为单个 JSON 文件的插件。
    // 默认文件名为 `vue-ssr-server-bundle.json`
    new VueSSRServerPlugin()
  ]
});

module.exports = config;