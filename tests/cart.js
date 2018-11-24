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
const _ = require('lodash');

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
  monitor = createNetworkMonitor(page, 100);

  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:8080');
  await monitor.waitForIdle();

  // page.on('console', (m) => console.log(m.text()));
});

After(async () => {
  await page.close();
  await browser.close();
});

// eslint-disable-next-line no-template-curly-in-string
When(/I select category (.+)/, async (category) => {
  await page.click(`.app-header-navigation-component li[data-name="${category}"] a.nav-link`);
  await monitor.waitForIdle();
});

When(/I select product (.+)/, async (product) => {
  await page.click(`.category-item-title a[data-name="${product}"]`);
  await monitor.waitForIdle();
});

When(/I select sku option (.+) and choose (.+)/, async (optionName, optionText) => {
  const value = await page.$eval(`select.product-configurator[data-name="${optionName}"] option[data-name="${optionText}"]`, e => e.value);
  await page.select(`select.product-configurator[data-name="${optionName}"]`, value);
});

When('I select quantity {int} and add product to my cart', async (quantity) => {
  await page.select('#product_display_item_quantity_select', quantity.toString());
  await monitor.waitForIdle();
  await page.click('#product_display_item_add_to_cart_button');
  await monitor.waitForIdle();
});

When(/I update cart lineitem quantity to (.+) for product (.+)/, async (quantity, product) => {
  await page.select(`.cart-lineitem-row[data-name="${product}"] .quantity-select`, quantity.toString());
  await monitor.waitForIdle();
});

Then(/the expected cart lineitem total price is (.+) for product (.+)/, async (expectedTotal, product) => {
  const total = await page.$eval(`.cart-lineitem-row[data-name="${product}"] .cart-total-purchase-price`, e => e.innerText);
  expect(total).to.be.equal(expectedTotal);
});

When(/I add following items to my cart/, async (items) => {
  for (const row of items.rows()) {
    const productCategory = row[0];
    const productSubCategory = row[1];
    const productName = row[2];

    await page.click(`.app-header-navigation-component li[data-name="${productCategory}"]`);
    await page.click(`.app-header-navigation-component li[data-name="${productCategory}"] > .dropdown-menu > a[title="${productSubCategory}"]`);
    await monitor.waitForIdle();

    const productLinkElem = (await page.$x(`//a[contains(text(), '${productName}')]`))[0];
    await productLinkElem.click();
    await monitor.waitForIdle();
    await page.click('#product_display_item_add_to_cart_button');
    await monitor.waitForIdle();
  }
});

When(/I remove the cart line item (.+)/, async (productName) => {
  const productLineElem = (await page.$x(`//div[@class="cart-lineitem-row"][//a[contains(text(), '${productName}')]]`))[0];
  const removeBtnElem = await productLineElem.$('.btn-cart-removelineitem');
  await removeBtnElem.click();
  await monitor.waitForIdle();
});

Then(/Lineitem (.+) is no longer in the cart/, async (productName) => {
  const productLineElems = await page.$x(`//div[@class="cart-lineitem-row"][//a[contains(text(), '${productName}')]]`);
  expect(productLineElems.length).to.be.equal(0);
});
