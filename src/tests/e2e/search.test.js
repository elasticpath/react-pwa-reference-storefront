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
      slowMo: 20,
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

    const SEARCH_INPUT_CSS = 'input.input-search';
    const PRODUCT_LIST_CSS = 'div[data-region="categoryPaginationRegion"]';
    const NO_RESULTS_CSS = 'div[data-region="categoryTitleRegion"] h3';

    // When I search for keyword 'hat'
    await page.waitForSelector(SEARCH_INPUT_CSS);
    await page.click(SEARCH_INPUT_CSS);
    await page.type(SEARCH_INPUT_CSS, dataSearch.searchHat);
    await page.keyboard.press( 'Enter' );

    // Then I can see my search results for keyword 'hat'
    await page.waitForSelector(PRODUCT_LIST_CSS);

    // When I search for keyword 'abc'
    await page.waitForSelector(SEARCH_INPUT_CSS);
    await page.click(SEARCH_INPUT_CSS);
    await page.type(SEARCH_INPUT_CSS, dataSearch.searchInvalidKeyword);
    await page.keyboard.press( 'Enter' );

    // Then no search results return for keyword 'abc'
    await page.waitForSelector(NO_RESULTS_CSS);

    await browser.close();
  }, 40000);
});
