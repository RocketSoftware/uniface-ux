const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = (env) => {
  return merge(common(env), {
    devtool: 'source-map',
    mode: 'development',
    devServer: {
      static: {
        directory: __dirname
      },
      devMiddleware: {
        publicPath: '/dist'
      },
      compress: true,
      port: 9000
    }
  });
};
