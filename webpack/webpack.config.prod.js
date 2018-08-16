/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
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

const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base.js');

const epConfig = require('../src/ep.config.json');

if (epConfig.cortexApi.pathForProxy !== '') {
  module.exports = merge(baseConfig, {
    performance: {
      hints: false,
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
      },
    },
    devServer: {
      historyApiFallback: true,
      compress: true,
      proxy: {
        '/cortex': {
          target: epConfig.cortexApi.pathForProxy,
        },
      },
    },
  });
} else {
  module.exports = merge(baseConfig, {
    performance: {
      hints: false,
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
      },
    },
    devServer: {
      historyApiFallback: true,
      compress: true,
    },
  });
}
