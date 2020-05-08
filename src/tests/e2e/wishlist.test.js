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

/* eslint-disable */
const { loginUser, navigateToProduct } = require('./common');
const puppeteer = require('puppeteer');

const scopeDir = process.env.SCOPE_DIR;
const testData = require(scopeDir);
const { defaultProduct } = testData.wishlist;

const host = process.env.TEST_HOST;
const APP = host || 'http://localhost:8080/';
const desktopViewport = {
  width: 1500,
  height: 700,
};

const userData = {
  email: 'john@ep.com',
  password: 'password'
};

const CART_LINK_CSS = '.cart-link-container .cart-link';
const LOGGED_IN_BUTTON = '#header_navbar_loggedIn_button';
const PRODUCT_CART_TITLE = 'div.title-options-col > div.title-col > a';
const ADD_TO_WISHLIST_BUTTON = '#product_display_item_add_to_wish_list_button';
const ADD_TO_CART_BUTTON = '.wish-list-container .btn-cart-moveToCart';
const REMOVE_FROM_WISHLIST_BUTTON = '.wish-list-container .btn-cart-removelineitem';
const WISHLIST_CONTAINER = 'div.wish-list-main-container';
const WISHLIST_LINK = '.wishlist-link';

describe('Wishlist', () => {
  test('Move wishlist item to cart', async () => {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      slowMo: 120,
    });
    const page = await browser.newPage();

    page.emulate({
      viewport: desktopViewport,
      userAgent: '',
    });
    await page.goto(APP, {
      timeout: 30000,
      waitUntil: 'domcontentloaded'
    });

    //When I login as following registered shopper
    await loginUser(page, userData);

    // When I add following items to my wishlist
    await navigateToProduct(page, defaultProduct);
    await page.waitForSelector(ADD_TO_WISHLIST_BUTTON);
    await page.click(ADD_TO_WISHLIST_BUTTON);

    // When I move the wishlist item to cart
    await page.waitForSelector(ADD_TO_CART_BUTTON);
    page.click(ADD_TO_CART_BUTTON);

    await page.waitForSelector(CART_LINK_CSS);
    await page.click(CART_LINK_CSS);

    // Then cart should contain following items
    await page.waitFor(3000);
    await page.waitForSelector(PRODUCT_CART_TITLE);
    const element = await page.$(PRODUCT_CART_TITLE);
    const text = await page.evaluate(el => el.textContent, element);
    expect(text).toEqual(defaultProduct.name);

    await browser.close();
  }, 60000);

  test('Remove wishlist item', async () => {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      slowMo: 30,
    });
    const page = await browser.newPage();

    page.emulate({
      viewport: desktopViewport,
      userAgent: '',
    });
    await page.goto(APP, {
      timeout: 30000,
      waitUntil: 'domcontentloaded'
    });

    //When I login as following registered shopper
    await loginUser(page, userData);

    // When I add following items to my wishlist
    await navigateToProduct(page, defaultProduct);
    await page.waitForSelector(ADD_TO_WISHLIST_BUTTON);
    await page.click(ADD_TO_WISHLIST_BUTTON);

    // When I remove the wishlist item
    await page.waitForSelector(REMOVE_FROM_WISHLIST_BUTTON);
    await page.click(REMOVE_FROM_WISHLIST_BUTTON);
    await page.waitForSelector(WISHLIST_CONTAINER);
    await page.waitFor(2000);

      // Then Lineitem is no longer in the wishlist
    await page.waitForSelector(LOGGED_IN_BUTTON);
    await page.click(LOGGED_IN_BUTTON);
    await page.waitForSelector(WISHLIST_LINK);
    await page.click(WISHLIST_LINK);
    await page.waitForSelector(WISHLIST_CONTAINER);
    const element = await page.$(PRODUCT_CART_TITLE);
    expect(element).toEqual(null);

    await browser.close();
  }, 50000);
});
