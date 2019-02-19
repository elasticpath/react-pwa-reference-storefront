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

const dataSearch = {
  searchHat: 'hat',
  searchInvalidKeyword: 'abc'
};
const host = process.env.TEST_HOST;
const APP = host || 'http://localhost:8080/';
const desktopViewport = {
  width: 1500,
  height: 700,
};

describe('Search feature', () => {
  test('Keyword search', async () => {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: false,
      slowMo: 80,
    });
    const page = await browser.newPage();

    page.emulate({
      viewport: desktopViewport,
      userAgent: '',
    });
    await page.goto(APP);

    const SEARCH_INPUT_CSS = 'input.input-search';
    const PRODUCT_LIST_CSS = '.product-list-pagination-component';
    const NO_RESULTS_CSS = 'div[data-region="categoryTitleRegion"] h3';

    // When I select search
    await page.waitForSelector(SEARCH_INPUT_CSS);
    await page.click(SEARCH_INPUT_CSS);

    // And I input searchHat
    await page.type(SEARCH_INPUT_CSS, dataSearch.searchHat);
    await page.keyboard.press( 'Enter' );

    // Then I expect product list
    await page.waitForSelector(PRODUCT_LIST_CSS);

    // When I select search
    await page.waitForSelector(SEARCH_INPUT_CSS);
    await page.click(SEARCH_INPUT_CSS);

    // And I input searchInvalidKeyword
    await page.type(SEARCH_INPUT_CSS, dataSearch.searchInvalidKeyword);
    await page.keyboard.press( 'Enter' );

    // Then I expect not found product list
    await page.waitForSelector(NO_RESULTS_CSS);

    browser.close();
  }, 20000);
});
