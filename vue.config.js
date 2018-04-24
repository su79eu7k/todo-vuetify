const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  devServer: {
    proxy: {
      "/api/*": {
        target: "http://127.0.0.1:3000",
        secure: false
      }
    }
  },
  configureWebpack: {
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new CompressionPlugin({
        asset: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.(js|html)$/,
        threshold: 10240, // 10kb
        minRatio: 0.8
      }),
      new WorkboxPlugin.InjectManifest({
        swSrc: './src/sw.js',
        swDest: 'service-worker.js',
        include: [/\.js$/, /\.html$/, /\.css$/],
        exclude: [/service-worker.*\.js/, /^precache-manifest\..+\.js/]
      }),
    ]
  },
};