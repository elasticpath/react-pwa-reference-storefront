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

const cucumber = require('cucumber');
const express = require('express');
const proxy = require('http-proxy-middleware');

// const app = express();
// let server;
// app.use('/cortex', proxy({ target: 'http://10.11.12.95:8080/' }));
// app.use(express.static('./webpack/dist'));

const {
  BeforeAll, AfterAll, setDefaultTimeout,
} = cucumber;

async function startServer(port) {
  return new Promise((resolve) => {
    server = app.listen(port, () => resolve);
  });
}

BeforeAll(async () => {
  setDefaultTimeout(30 * 1000);
  // await startServer(3456);
});

AfterAll(async () => {
  // server.close(() => resolve());
});
