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

const userData = {
  username: 'john@ep.com',
  password: 'password'
};

const LOGGED_IN_BUTTON = '#header_navbar_loggedIn_button';
const LOGIN_USERNAME_INPUT = '#login_modal_username_input';
const LOGIN_PASSWORD_INPUT = '#login_modal_password_input';
const LOGIN_BUTTON = '#login_modal_login_button';
const PARENT_CATEGORY = '.app-header-navigation-component li[data-name="M-Class"]';
const PARENT_SUB_CATEGORY = 'li[data-name="M-Class"] #header_navbar_sub_category_button_VESTRI_MODEL_S_WHEELS_AND_TIRES';
const PRODUCT_CATEGORY_ITEM = '#category_item_title_link_VESTRI_MODEL_S_RED_BRAKE_CALIPER';
const CART_ITEM = '.cart-container #cart_lineitem_VESTRI_MODEL_S_RED_BRAKE_CALIPER';
const PRODUCT_CART_ITEM = '.wish-list-container #cart_lineitem_VESTRI_MODEL_S_RED_BRAKE_CALIPER';
const PRODUCT_CART_TITLE = '.cart-container #cart_lineitem_VESTRI_MODEL_S_RED_BRAKE_CALIPER .title-col a';
const ADD_TO_WISHLIST_BUTTON = '#product_display_item_add_to_wish_list_button';
const ADD_TO_CART_BUTTON = '.wish-list-container #cart_lineitem_VESTRI_MODEL_S_RED_BRAKE_CALIPER .btn-cart-moveToCart';
const REMOVE_FROM_WISHLIST_BUTTON = '.wish-list-container #cart_lineitem_VESTRI_MODEL_S_RED_BRAKE_CALIPER .btn-cart-removelineitem';
const WISHLIST_CONTAINER = '.wish-list-container';
const WISHLIST_LINK = '.wishlist-link';

const EXPECTED_ITEM_TITLE = 'M Class Red Brake Calipers';

describe('Wishlist', () => {
  test('Move wishlist item to cart', async () => {
    const browser = await puppeteer.launch({
      slowMo: 20,
    });
    const page = await browser.newPage();

    page.emulate({
      viewport: desktopViewport,
      userAgent: '',
    });
    await page.goto(APP);

    //When I login as following registered shopper
    await page.waitForSelector(LOGGED_IN_BUTTON);
    await page.click(LOGGED_IN_BUTTON);
    await page.waitForSelector(LOGIN_USERNAME_INPUT);
    page.$eval(LOGIN_USERNAME_INPUT, el => el.value = '');
    await page.type(LOGIN_USERNAME_INPUT, userData.username);
    await page.waitForSelector(LOGIN_PASSWORD_INPUT);
    page.$eval(LOGIN_PASSWORD_INPUT, el => el.value = '');
    await page.type(LOGIN_PASSWORD_INPUT, userData.password);
    await page.waitForSelector(LOGIN_BUTTON);
    await page.click(LOGIN_BUTTON);

    // When I add following items to my wishlist
    await page.waitForNavigation(PARENT_CATEGORY);
    await page.click(PARENT_CATEGORY);
    await page.waitForSelector(PARENT_SUB_CATEGORY);
    await page.click(PARENT_SUB_CATEGORY);
    await page.waitForSelector(PRODUCT_CATEGORY_ITEM);
    await page.click(PRODUCT_CATEGORY_ITEM);
    await page.waitForSelector(ADD_TO_WISHLIST_BUTTON);
    await page.click(ADD_TO_WISHLIST_BUTTON);

    // When I move the wishlist item to cart
    await page.waitForSelector(ADD_TO_CART_BUTTON);
    await page.click(ADD_TO_CART_BUTTON);

    // Then cart should contain following items
    await page.waitForSelector(CART_ITEM);
    const element = await page.$(PRODUCT_CART_TITLE);
    const text = await page.evaluate(el => el.textContent, element);
    expect(text).toEqual(EXPECTED_ITEM_TITLE);
  
    await browser.close();
  }, 25000);

  test('Remove wishlist item', async () => {
    const browser = await puppeteer.launch({
      slowMo: 20,
    });
    const page = await browser.newPage();

    page.emulate({
      viewport: desktopViewport,
      userAgent: '',
    });
    await page.goto(APP);

    //When I login as following registered shopper
    await page.waitForSelector(LOGGED_IN_BUTTON);
    await page.click(LOGGED_IN_BUTTON);
    await page.waitForSelector(LOGIN_USERNAME_INPUT);
    page.$eval(LOGIN_USERNAME_INPUT, el => el.value = '');
    await page.type(LOGIN_USERNAME_INPUT, userData.username);
    await page.waitForSelector(LOGIN_PASSWORD_INPUT);
    page.$eval(LOGIN_PASSWORD_INPUT, el => el.value = '');
    await page.type(LOGIN_PASSWORD_INPUT, userData.password);
    await page.waitForSelector(LOGIN_BUTTON);
    await page.click(LOGIN_BUTTON);

    // When I add following items to my wishlist
    await page.waitForNavigation(PARENT_CATEGORY);
    await page.click(PARENT_CATEGORY);
    await page.waitForSelector(PARENT_SUB_CATEGORY);
    await page.click(PARENT_SUB_CATEGORY);
    await page.waitForSelector(PRODUCT_CATEGORY_ITEM);
    await page.click(PRODUCT_CATEGORY_ITEM);
    await page.waitForSelector(ADD_TO_WISHLIST_BUTTON);
    await page.click(ADD_TO_WISHLIST_BUTTON);

    // When I remove the wishlist item
    await page.waitForSelector(REMOVE_FROM_WISHLIST_BUTTON);
    await page.click(REMOVE_FROM_WISHLIST_BUTTON);

    // Then Lineitem is no longer in the wishlist
    await page.waitForSelector(CART_ITEM);
    await page.waitForSelector(LOGGED_IN_BUTTON);
    await page.click(LOGGED_IN_BUTTON);
    await page.waitForSelector(WISHLIST_LINK);
    await page.click(WISHLIST_LINK);
    await page.waitForSelector(WISHLIST_CONTAINER);
    const element = await page.$(PRODUCT_CART_ITEM);
    expect(element).toEqual(null);
  
    await browser.close();
  }, 25000);
});
