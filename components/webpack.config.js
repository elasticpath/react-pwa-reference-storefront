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
const merge = require('webpack-merge');
const configBase = require('./webpack.config.base.js');

const cjsConfig = merge(configBase, {
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, './build/cjs'),
    library: 'index',
    libraryTarget: 'commonjs2',
  },
});

const umdConfig = merge(configBase, {
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, './build/umd'),
    library: 'index',
    libraryTarget: 'umd',
  },
});

module.exports = function (webpackEnv) {
  return [cjsConfig, umdConfig];
};
