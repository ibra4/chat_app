var path = require("path");
var LiveReloadPlugin = require("webpack-livereload-plugin");

module.exports = {
  entry: ["babel-polyfill", "./index.js"],
  resolve: {
    extensions: [".js", ".jsx"],
    modules: [
      "node_modules",
      "./src/components",
      "./src/pages",
      "./src",
    ],
    alias: {
      react: path.resolve("./node_modules/react"),
    },
  },
  // plugins: [
  //   new LiveReloadPlugin({
  //     hostname: "http://52.202.149.74:8000/",
  //   }),
  // ],
  devtool: "source-map",
  node: {
    child_process: 'empty',
    fs: 'empty',
    crypto: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                ["@babel/preset-env", { modules: "commonjs" }],
                "@babel/preset-react",
              ],
              plugins: ["add-react-displayname"],
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 25000
          }
        }
      },
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      }, {
        test: /\.css$/,
        loaders: ["style-loader", "css-loader"]
      }
    ],
  },
};