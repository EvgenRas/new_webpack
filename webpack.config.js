const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const postcssPresetEnv = require('postcss-preset-env');
const ImageminPlugin = require("imagemin-webpack");
const libImport = '@import \'./src/assets/scss/mixins.scss\';';

const PATHS = {
  src: path.join(__dirname, "./src"),
  dist: path.join(__dirname, path.basename(__dirname)),
};
module.exports = {
    mode: 'development',
    entry:
    {
      main: `${PATHS.src}/index.js`
    },
    output: {
      path: path.resolve(__dirname, PATHS.dist),
      filename: '[name].[contenthash].js',
      clean: true
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: `${PATHS.src}/index.pug`,
        favicon: `${PATHS.src}/favicon.ico`
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
        paths: [`${PATHS.src}/**/*.*`],
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
            "sass-loader",
            'webpack-append?'+ libImport
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