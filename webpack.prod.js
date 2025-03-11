const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = (env) => {
  return merge(common(env), {
    mode: 'none',
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin(),
        new CssMinimizerPlugin()
      ]
    }
  });
};
