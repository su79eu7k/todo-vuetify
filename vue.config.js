const path = require('path');
const CompressionPlugin = require("compression-webpack-plugin");


module.exports = {
  configureWebpack: {
    plugins: [
      new CompressionPlugin({
        asset: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.(js|html)$/,
        threshold: 10240, // 10kb
        minRatio: 0.8
      })
    ]
  },
};