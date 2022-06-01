const path = require("path");
const GasPlugin = require("gas-webpack-plugin");

module.exports = {

  // バンドルの起点となるファイルを指定
  entry: './src/index.ts',

  // バンドルしたファイルの出力先を指定
  output: {
    path: path.join(__dirname, "dist"),
    filename: 'bundle.js',
  },
  mode: "development",
  devtool: false,

  // import 文で拡張子がなくてもイケるようにする設定
  resolve: {
    modules: [
      path.resolve('./src'),
      "node_modules",
    ],
    extensions: [".ts", ".js"],
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
      }
    ],
  },

  plugins: [
    new GasPlugin({
      autoGlobalExportsFiles: ['**/*.ts'],
    }),
  ],
};