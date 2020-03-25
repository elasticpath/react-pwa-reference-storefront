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

const puppeteer = require('puppeteer');

const host = process.env.TEST_HOST;
const APP = host || 'http://localhost:8080/';
const desktopViewport = {
  width: 1500,
  height: 700,
};

async function getPrice(page, selector) {
  await page.waitFor(2000);
  await page.waitForSelector(selector);
  const element = await page.$(selector);
  const text = await page.evaluate(el => el.textContent, element);
  if (text) {
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }
}

describe('Cart feature', () => {

  test('Change cart line item quantity', async () => {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
    });
    const page = await browser.newPage();
    await page.setViewport(desktopViewport);

    await page.goto(APP, {
      timeout: 30000,
      waitUntil: 'domcontentloaded'
    });

    const PARENT_CATEGORY_CSS = '.app-header-navigation-component li[data-name="Mens"]';
    const PRODUCT_CSS = '#category_item_title_link_VESTRI_MENS_VESTRI_POLO_LOGO_HG_MD';
    const SKU_OPTION_SELECT_CSS = 'div[id="product_display_item_sku_guide"] > div > label[for*="selectorWeight_black"]';
    const SKU_BUTTON_SELECT_CSS = 'div[id="product_display_item_size_guide"] > div > label[for*="selectorWeight_small"]';
    const ADD_TO_CART_BUTTON_CSS = 'button[id="product_display_item_add_to_cart_button"]';
    const QUANTITY_SELECT_CSS = 'input[id="product_display_quantity_field"]';
    const PRODUCT_DETAIL_CSS = 'div[class="itemdetail-details"]';
    const PRODUCT_PRICE_CSS = "#category_item_price_VESTRI_MENS_VESTRI_POLO_LOGO_HG_MD";
    const CART_LINE_ITEM_PRICE_CSS = "div[data-region='itemTotalPriceRegion'] .cart-total-purchase-price";

    const PRODUCT_QUANTITY = 2;

    // When I select category Mans
    await page.waitForSelector(PARENT_CATEGORY_CSS);
    page.click(PARENT_CATEGORY_CSS);

    // And I select product Men's Vestri Polo Logo
    await page.waitForSelector(PRODUCT_CSS);
    page.click(PRODUCT_CSS);

    await page.waitForSelector(PRODUCT_DETAIL_CSS);
    const productPrice = await getPrice(page, PRODUCT_PRICE_CSS);

    // And I choose sku color option Black
    await page.waitForSelector(SKU_OPTION_SELECT_CSS);
    await Promise.all([
      page.click(SKU_OPTION_SELECT_CSS),
      // page.waitForNavigation()
    ]);

    // And I choose sku size option Small
    await page.waitForSelector(SKU_BUTTON_SELECT_CSS);
    await Promise.all([
      page.click(SKU_BUTTON_SELECT_CSS),
      page.waitForNavigation()
    ]);

    // And I update cart quantity to 2
    await page.waitForSelector(QUANTITY_SELECT_CSS);
    page.$eval(QUANTITY_SELECT_CSS, el => el.value = '');
    await page.type(QUANTITY_SELECT_CSS, PRODUCT_QUANTITY.toString());

    // And I add product to my cart
    await page.waitForSelector(ADD_TO_CART_BUTTON_CSS);
    page.click(ADD_TO_CART_BUTTON_CSS);

    // Then the expected cart lineitem total price is EXPECTED_ITEM_TOTAL
    await page.waitForSelector(CART_LINE_ITEM_PRICE_CSS);
    const price = await getPrice(page, CART_LINE_ITEM_PRICE_CSS);

    await browser.close();

    expect(price).toEqual(productPrice * PRODUCT_QUANTITY);
  }, 120000);

  test('Remove cart line item', async () => {
    const product = {
      category: 'M-Class',
      subCategory: 'Wheels, Tires, and Tire Covers',
      name: 'M Class Snowchain Trak Sport'
    };

    const PARENT_CATEGORY_CSS = `.app-header-navigation-component li[data-name="${product.category}"]`;
    const SUB_CATEGORY_CSS = `${PARENT_CATEGORY_CSS} > .dropdown-menu > li > a[title="${product.subCategory}"]`;
    const PRODUCT_CSS = '.product-list-container .category-items-listing .category-item-container';
    const ADD_TO_CART_BUTTON_CSS = 'button[id="product_display_item_add_to_cart_button"]';
    const CART_LINE_ITEM_REMOVE_BTN_CSS = 'button[class="ep-btn small btn-cart-removelineitem"]';
    const CART_EMPTY_CONTAINER_CSS = 'div[class="cart-empty-container"]';

    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
    });
    const page = await browser.newPage();
    await page.setViewport(desktopViewport);
    await page.goto(APP, {
      timeout: 30000,
      waitUntil: 'domcontentloaded'
    });

    await page.waitForSelector(PARENT_CATEGORY_CSS);
    await page.click(PARENT_CATEGORY_CSS);

    await page.waitForSelector(SUB_CATEGORY_CSS);
    await page.click(SUB_CATEGORY_CSS);

    await page.waitForSelector(PRODUCT_CSS);
    const productLink = await page.$x(`//a[contains(text(), "${product.name}")]`);

    if (productLink.length > 0) {
      await productLink[0].click();
    } else {
      throw new Error('Product not found');
    }

    await page.waitForSelector(ADD_TO_CART_BUTTON_CSS);
    await page.click(ADD_TO_CART_BUTTON_CSS);

    await page.waitForSelector(CART_LINE_ITEM_REMOVE_BTN_CSS);
    await page.click(CART_LINE_ITEM_REMOVE_BTN_CSS);

    await page.waitForSelector(CART_EMPTY_CONTAINER_CSS);
    const element = await page.$(CART_EMPTY_CONTAINER_CSS);

    await browser.close();

    expect(element).not.toEqual(null)
  }, 120000);
});
