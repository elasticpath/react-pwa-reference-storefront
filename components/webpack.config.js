/**
 * Copyright © 2019 Elastic Path Software Inc. All rights reserved.
 *
 * This is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this license. If not, see
 *
 *     https://www.gnu.org/licenses/
 *
 *
 */
const path = require('path');

const DeclarationBundlerPlugin = require('declaration-bundler-webpack-plugin');
// This is the production and development configuration.
// It is focused on developer experience, fast rebuilds, and a minimal bundle.
module.exports = function (webpackEnv) {
  return {
    devtool: 'source-map',
    mode: 'production',
    entry: './src/index',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, './build'),
      library: 'index',
      libraryTarget:'umd'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)?$/,
          exclude: /(node_modules)/,
          loaders: [
              'babel-loader',
          ]
        },
        {
          test: /\.(ts|tsx)?$/,
          use: {
            loader: 'ts-loader'
          },
          exclude: /node_modules/
        },
        {
          test: /\.(css|less)?$/,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
            {
              loader: 'less-loader',
              options: {
                paths: [path.resolve(__dirname, 'node_modules')],
              },
            },
          ],
        },
      {
        test: /\.(png|jp(e*)g|svg|gif|jp2)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8000, // Convert images < 8kb to base64 strings
            name: '[hash]-[name].[ext]',
          },
        }],
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/',
          },
        }],
      },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx", ".css", ".less"],
      mainFields: ['main'],
    },
    externals: {
      react: {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react',
        var: 'react',
        window: 'React'
      },
      'react-dom': {
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'react-dom',
        var: 'react-dom',
        window: 'ReactDOM'
      }
    }
  };
};
