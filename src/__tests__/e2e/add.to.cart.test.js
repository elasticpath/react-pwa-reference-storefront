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

/* eslint-disable */

const puppeteer = require('puppeteer');

const host = process.env.TEST_HOST;
const APP = host || 'http://localhost:8080/';
const desktopViewport = {
  width: 1500,
  height: 700,
};

describe('App', () => {
  test('Cart feature', async () => {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: true,
      slowMo: 80,
    });
    const page = await browser.newPage();

    page.emulate({
      viewport: desktopViewport,
      userAgent: '',
    });
    await page.goto(APP);

    const PARENT_CATEGORY_CSS = '.app-header-navigation-component li[data-name="Mens"]';
    const PRODUCT_CSS = '#category_item_title_link_VESTRI_MENS_SOFT_SHELL_JACKET_RD_LG';
    const SKU_OPTION_SELECT_CSS = 'div[id="product_display_item_sku_guide"] > div > label[for*="selectorWeight_black"]';
    const SKU_BUTTON_SELECT_CSS = 'div[id="product_display_item_size_guide"] > div > label[for*="selectorWeight_small"]';
    const ADD_TO_CART_BUTTON_CSS = 'button[id="product_display_item_add_to_cart_button"]';
    const QUANTITY_SELECT_CSS = 'input[class="product-display-item-quantity-select form-control form-control-quantity"]';
    const CART_LINE_ITEM_PRICE_CSS = "div[data-region='itemTotalPriceRegion'] .cart-total-purchase-price";

    const EXPECTED_ITEM_TOTAL = '$340.10';

    // When I select category Mans
    await page.waitForSelector(PARENT_CATEGORY_CSS);
    page.click(PARENT_CATEGORY_CSS);

    // And I select product Men's Soft Shell Jacket
    await page.waitForSelector(PRODUCT_CSS);
    page.click(PRODUCT_CSS);

    // And I choose sku color option Black
    await page.waitForSelector(SKU_OPTION_SELECT_CSS);
    page.click(SKU_OPTION_SELECT_CSS);

    // And I choose sku size option Small
    await page.waitForSelector(SKU_BUTTON_SELECT_CSS);
    page.click(SKU_BUTTON_SELECT_CSS);

    // And I update cart quantity to 2
    await page.waitForSelector(QUANTITY_SELECT_CSS);
    page.$eval(QUANTITY_SELECT_CSS, el => el.value = '');
    await page.type(QUANTITY_SELECT_CSS, '2', { delay: 20 });

    // And I add product to my cart
    await page.waitForSelector(ADD_TO_CART_BUTTON_CSS);
    page.click(ADD_TO_CART_BUTTON_CSS);

    // Then the expected cart lineitem total price is EXPECTED_ITEM_TOTAL
    await page.waitForSelector(CART_LINE_ITEM_PRICE_CSS);
    const element = await page.$(CART_LINE_ITEM_PRICE_CSS);
    const text = await page.evaluate(el => el.textContent, element);
    expect(text).toEqual(EXPECTED_ITEM_TOTAL);

    browser.close();
  }, 25000);
});
