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
const puppeteer = require('puppeteer');
const chai = require('chai');
const createNetworkMonitor = require('./monitor.js').createNetworkMonitor;

const { expect } = chai;
const {
  Before, After, When, Then, Given,
} = cucumber;

let browser;
let page;
let monitor;

Before(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  monitor = createNetworkMonitor(page, 500);

  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:8080');
  await monitor.waitForIdle();
  await page.screenshot({ path: 'screenshot0.png' });

  // page.on('error', (e) => console.error(e));
  // page.on('pageerror', (e) => console.error(e));
  page.on('console', (m) => console.log(m.text()));
});

After(async () => {
  await page.close();
  await browser.close();
});

// eslint-disable-next-line no-template-curly-in-string
When(/I select category (.+)/, async (category) => {
  // await page.click(`.app-header-navigation-component li[data-name="${category}"] a.nav-link`);
  // await monitor.waitForIdle();
  console.log(category);
});

Given(/I select product (.+)/, async (product) => {
  // await page.click(`.category-item-title a[data-name="${product}"]`);
  // await monitor.waitForIdle();
  // await page.screenshot({ path: 'screenshot.png' });
  console.log(product);
});


Then('', async () => {
});
