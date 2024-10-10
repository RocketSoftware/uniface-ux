const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = (_) => ({
  plugins: [new MiniCssExtractPlugin(
    {filename:"unifaceux.min.css"}
  )],
  context: path.resolve(__dirname, 'src','ux'),
  entry: ["./loader.js", "./loader.css"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "unifaceux.min.js",
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ]
  },
});
