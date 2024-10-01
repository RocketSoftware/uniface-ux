const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const path = require('path');

module.exports = {
  plugins: [new MiniCssExtractPlugin(
    {filename:"unifaceux.min.css"}
  )],
  mode: 'none',
  // other configuration options...
  devtool: "source-map",
  context: path.resolve(__dirname, 'src','ux'),
  entry: ["./loader.js", "./loader.css"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "unifaceux.min.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
    ],
  }
};
