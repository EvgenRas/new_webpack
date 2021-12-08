const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const postcssPresetEnv = require('postcss-preset-env');
const libImport = '@import \'./src/assets/scss/mixins.scss\';';
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { extendDefaultPlugins } = require("svgo");

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
      filename: 'js/[name].[contenthash].js',
      clean: true
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: `${PATHS.src}/index.pug`,
        favicon: `${PATHS.src}/favicon.ico`
      }),
      new MiniCssExtractPlugin({
        linkType: "text/css",
        filename: 'css/[name][contenthash].css'
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
          test: /\.(jpe?g|png|gif|svg)$/i,
          type: "asset/resource",
          generator: {
            filename: 'img/[hash][ext]',
          },
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          type: "asset/resource",
          generator: {
            filename: 'fonts/[hash][ext]',
          },
        }
      ]
    },
    optimization: {
      minimizer: [
        new ImageMinimizerPlugin({
          generator: [
            {
              preset: "webp",
              implementation: ImageMinimizerPlugin.imageminGenerate,
              options: {
                plugins: ["imagemin-webp"],
              },
            },
          ],
          minimizer: {
            implementation: ImageMinimizerPlugin.imageminMinify,
            options: {
              plugins: [
                ["gifsicle", { interlaced: true }],
                ["jpegtran", { progressive: true }],
                ["optipng", { optimizationLevel: 3 }],
                [
                  "svgo",
                  {
                    plugins: extendDefaultPlugins([
                      {
                        name: "removeViewBox",
                        active: false,
                      },
                      {
                        name: "addAttributesToSVGElement",
                        params: {
                          attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
                        },
                      },
                    ]),
                  },
                ],
              ],
            },
          },
        }),
      ],
    },
 }