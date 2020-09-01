var path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

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
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        extractComments: "all",
        uglifyOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
  devtool: "source-map",
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
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      }, {
        test: /\.css$/,
        loaders: ["style-loader", "css-loader"]
      }
    ],
  },
};