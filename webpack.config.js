const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        popup: '.\/src\/popup.jsx',
        background: '.\/src\/background.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react'],
                }
            }
        },
        {
            test: /\.(sass|css|scss)$/,
            use: [
              'style-loader',
              'css-loader',
              {
                loader: "postcss-loader",
                options: {
                  plugins: () => [
                    require("autoprefixer")()
                  ],
                },
              },
              'sass-loader',
            ]
        },
    ],
    },
    plugins: [
        new HtmlWebpackPlugin({
        template: '.\/src\/popup.html',
        filename: 'popup.html',
        }),
        new CopyPlugin({
            patterns: [
              { from: "public" },
            ],
        }),
    ],
};