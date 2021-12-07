const path = require('path');
const project_folder = path.basename(__dirname);
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const postcssPresetEnv = require('postcss-preset-env');
const ImageminPlugin = require("imagemin-webpack");

module.exports = {
    mode: 'development',
    entry:
    {
      main: './src/index.js'
    },
    output: {
      path: path.resolve(__dirname, project_folder),
      filename: '[name].[contenthash].js',
      clean: true
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.pug",
        favicon: "./src/favicon.ico"
      }),
      new MiniCssExtractPlugin(),
      new ImageminPlugin({
        bail: false, // Ignore errors on corrupted images
        cache: true,
        imageminOptions: {
          // Lossless optimization with custom option
          // Feel free to experiment with options for better result for you
          plugins: [
            ["gifsicle", { interlaced: true }],
            ["jpegtran", { progressive: true }],
            ["optipng", { optimizationLevel: 3 }],
            [
              "svgo",
              {
                plugins: [
                  {
                    removeViewBox: false
                  }
                ]
              }
            ]
          ]
        }
      })
    ],
    devServer: {
      watchFiles: {
        paths: ['src/**/*.*'],
        options: {
          usePolling: false,
        },
      },
      port: 9000,
    },
    module: {
      rules: [
        // pug
        {
          test: /\.pug$/,
          use: [
            {
              loader: "pug-loader",
              options: {
                pretty: true
              }
            }
          ]
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [postcssPresetEnv()],
                },
              },
            },
            "group-css-media-queries-loader",
            "sass-loader"
          ]
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          }
        }
      ]
    }
 }