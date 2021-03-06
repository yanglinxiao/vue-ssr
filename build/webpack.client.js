const path = require('path');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isProduction = process.env.NODE_ENV === 'production';

const config = merge(commonConfig, {
  entry: {
    client: path.resolve(__dirname, '../src/entry-client.js')
  },
  devServer: {
    // open: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 10,
      minChunks: 1,
      name: true,
      maxAsyncRequests: 10,
      maxInitialRequests: 10,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader', {
          loader: 'css-loader',
          options: {
            esModule: false
          }
        }],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.client.html'),
      filename: 'index.client.html'
    }),
    new VueSSRClientPlugin()
  ]
});

if (isProduction) {
  config.plugins.push(new MiniCssExtractPlugin({
    filename: 'static/css/[name].css',
    chunkFilename: 'static/css/[name].css'
  }))
}

module.exports = config;