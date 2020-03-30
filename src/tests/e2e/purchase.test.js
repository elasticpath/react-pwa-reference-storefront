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

const {
  registerUser,
  addAddress,
  addPaymentMethodToOrder,
  loginUserRegister,
  loginUser,
  addProductToCart
} = require('./common');
const puppeteer = require('puppeteer');

const host = process.env.TEST_HOST;
const APP = host || 'http://localhost:8080/';

const desktopViewport = {
  width: 1500,
  height: 700,
};

async function getChartItems(page) {
  const CART_LINE_ITEM_NAME_CSS = 'div[data-el-value="lineItem.displayName"]';

  await page.waitForSelector(CART_LINE_ITEM_NAME_CSS);
  const cartItems = await page.$$(CART_LINE_ITEM_NAME_CSS);

  let chartItems = [];
  for (let item of cartItems) {
    const text = await page.evaluate(el => el.textContent, item);
    chartItems.push(text);
  }

  return chartItems;
}

const CART_LINK_CSS = '.cart-link-container .cart-link';
const HOME_PAGE_CSS = 'div.home-page-component';
const REGISTER_BUTTON_CSS = "div[data-region='checkoutAutRegisterOptionRegion'] button.checkout-auth-option-register-btn";
const CHECKOUT_BUTTON_CSS = "button[class='ep-btn primary btn-cmd-checkout']";
const ADD_NEW_ADDRESS_CSS = 'button[data-region="billingAddressButtonRegion"]';
const ADD_NEW_PAYMENT_CSS = 'button[class="ep-btn primary wide new-payment-btn"]';
const ANONYMOUS_EMAIL_INPUT_CSS = 'div[data-region="anonymousCheckoutFeedbackRegion"] ~div input[id="Email"]';
const CHECKOUT_AUTH_BUTTON_CSS = 'button[class="ep-btn primary wide checkout-auth-option-anonymous-checkout-btn"]';
const COMPLETE_ORDER_BUTTON_CSS = 'button.btn-cmd-submit-order';
const ORDER_MAIN_CONTAINER_CSS = 'div.order-main-container';
const ORDER_STATUS_CSS = 'td[data-el-value="status"]';
const CHECKOUT_MAIN_CONTAINER_CSS = 'div.checkout-main-container';
const PURCHASE_NUMBER_ORDER_CSS = 'td[data-el-value="purchaseNumber"]';
const LOGIN_BUTTON_CSS = '#header_navbar_loggedIn_button';
const PURCHASE_HISTORY_CSS = 'div[data-region="profilePurchaseHistoryRegion"]';
const PURCHASE_STATUS_CSS = 'table[class="table table-condensed striped-table"] > tbody > tr > td[data-el-value="purchase.status"]';
const PURCHASE_NUMBER_CSS = 'table[class="table table-condensed striped-table"] > tbody > tr > td[data-el-value="purchase.number"]';
const ORDER_MAIN_CONTAINER = 'div.order-main-container';
const CHECKOUT_ADDRESS_SELECTOR_CSS = 'div[data-region="checkoutAddressSelector"]';
const BILLING_ADDRESS_SELECTORS_REGION_CSS = 'div[data-region="billingAddressSelectorsRegion"]';
const PAYMENT_SELECTOR_CSS = 'div[data-region="paymentSelector"]';
const PAYMENT_METHOD_REGION_CSS = 'div[data-region="paymentMethodSelectorsRegion"]';
const CREATED_PAYMENT_METHOD = ".paymentMethodComponentRegion";
const CREATED_ADDRESS_METHOD = ".address-ctrl-cell";
const PURCHASE_HISTORY_ITEM = "#header_navbar_login_menu_purchase_history_link";
const LOGIN_MODAL_ITEM = 'button[data-target="#login-modal"';
const LOGIN_MODAL_REGISTER_BUTTON = '#login_modal_register_button';
const MY_PROFILE = 'span[id="header_navbar_login_menu_profile_link"]';
const DROPDOWN_LOGGED_IN_BUTTON = '.dropdown-toggle#header_navbar_loggedIn_button';
const PROFILE_ADDRESS_ITEM = 'li[data-region="profileAddressContainer"]';

const purchaseTestUser = {
  firstName: 'Test',
  lastName: 'Test',
  email: `test_${Math.random().toString(36).substring(7)}@test.com`,
  password: '12345678_test',
};

describe('Purchase feature', () => {
    test('Create user for purchase feature tests', async () => {
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-web-security'],
        slowMo: 30,
      });
      const page = await browser.newPage();
      await page.setViewport(desktopViewport);
      await page.goto(APP, {
        timeout: 30000,
        waitUntil: 'domcontentloaded'
      });
  
      await page.waitFor(3000);
      await page.waitForSelector(LOGIN_MODAL_ITEM);
      await page.click(LOGIN_MODAL_ITEM);
  
      await page.waitForSelector(LOGIN_MODAL_REGISTER_BUTTON);
      await page.click(LOGIN_MODAL_REGISTER_BUTTON);
      
      await page.waitFor(2000);
      await registerUser(page, purchaseTestUser);
      await page.waitFor(2000);
  
      await page.waitForSelector(DROPDOWN_LOGGED_IN_BUTTON);
      await page.click(DROPDOWN_LOGGED_IN_BUTTON);

      await page.waitForSelector(MY_PROFILE);
      await page.click(MY_PROFILE);
  
      await page.waitForSelector(ADD_NEW_ADDRESS_CSS);
      await page.click(ADD_NEW_ADDRESS_CSS);
  
      const address = {
        postalCode: '12345',
        province: 'Washington',
        city: 'Seattle',
        country: 'United States',
      } ;
      await addAddress(page, address);
      await page.waitForSelector(PROFILE_ADDRESS_ITEM);
      await page.waitFor(3000);
      await page.click(ADD_NEW_PAYMENT_CSS);
  
      const paymentMethod = {
        cardType: 'Visa',
        cardHolderName: 'Test User',
        cardNumber: '4111111111111111',
        expiryMonth: '10',
        expiryYear: '2025',
        securityCode: '123',
      };
  
      await addPaymentMethodToOrder(page, paymentMethod);
  
      const CREATED_PAYMENT_METHOD_DATA = 'span[data-el-value="payment.token"]';
      await page.waitForSelector(CREATED_PAYMENT_METHOD_DATA);
      const element = await page.$(CREATED_PAYMENT_METHOD_DATA);
      const text = await page.evaluate(el => el.textContent, element);
      const lastDigits = text.substr(text.length - 4);
      await browser.close();
      
      expect(lastDigits).toEqual('1111');
    }, 60000);
    
    test('Purchase physical item as a new shopper', async () => {
    const SUCCESS_ORDER_STATUS = 'In Progress';

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-web-security'],
      slowMo: 30,
    });
    const page = await browser.newPage();
    await page.setViewport(desktopViewport);
    await page.goto(APP, {
      timeout: 30000,
      waitUntil: 'domcontentloaded'
    });
    await addProductToCart(page, 'Mens', '', 'Wordmark Fitted Hat');

    await page.waitForSelector(CART_LINK_CSS);
    await page.click(CART_LINK_CSS);

    await page.waitForSelector(CHECKOUT_BUTTON_CSS);
    await page.click(CHECKOUT_BUTTON_CSS);

    await page.waitForSelector(REGISTER_BUTTON_CSS);
    await page.click(REGISTER_BUTTON_CSS);

    const userInfo = {
      firstName: 'Test',
      lastName: 'Test',
      email: `test_${Math.random().toString(36).substring(7)}@test.com`,
      password: '12345678_test',
    } ;
    await registerUser(page, userInfo);
    await page.waitFor(2000);

    await page.waitForSelector(CART_LINK_CSS);
    await page.waitFor(2000);
    await page.click(CART_LINK_CSS);

    await page.waitForSelector(CHECKOUT_BUTTON_CSS);
    await page.click(CHECKOUT_BUTTON_CSS);

    await page.waitForSelector(ADD_NEW_ADDRESS_CSS);
    await page.click(ADD_NEW_ADDRESS_CSS);

    const address = {
      postalCode: '12345',
      province: 'Washington',
      city: 'Seattle',
      country: 'United States',
    } ;
    await addAddress(page, address);
    await page.waitForSelector(CREATED_ADDRESS_METHOD);
    await page.waitFor(3000);
    await page.click(ADD_NEW_PAYMENT_CSS);

    const paymentMethod = {
      cardType: 'Visa',
      cardHolderName: 'Test User',
      cardNumber: '4111111111111111',
      expiryMonth: '10',
      expiryYear: '2025',
      securityCode: '123',
    };

    await addPaymentMethodToOrder(page, paymentMethod);

    await page.waitForSelector(CREATED_PAYMENT_METHOD);
    await page.waitFor(3000);
    await page.waitForSelector(COMPLETE_ORDER_BUTTON_CSS);
    await page.click(COMPLETE_ORDER_BUTTON_CSS);

    await page.waitForSelector(ORDER_MAIN_CONTAINER_CSS);
    await page.waitForSelector(COMPLETE_ORDER_BUTTON_CSS);
    await page.click(COMPLETE_ORDER_BUTTON_CSS);

    await page.waitForSelector(ORDER_STATUS_CSS);
    const element = await page.$(ORDER_STATUS_CSS);
    const text = await page.evaluate(el => el.textContent, element);

    await browser.close();

    expect(text).toEqual(SUCCESS_ORDER_STATUS);
  }, 120000);

  test('Purchase physical item as an anonymous shopper', async () => {
    const SUCCESS_ORDER_STATUS = 'In Progress';

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-web-security'],
      slowMo: 10,
    });
    const page = await browser.newPage();
    await page.setViewport(desktopViewport);
    await page.goto(APP, {
      timeout: 30000,
      waitUntil: 'domcontentloaded'
    });
    await addProductToCart(page, 'Mens', '', 'Wordmark Fitted Hat');

    await page.waitForSelector(CHECKOUT_BUTTON_CSS);
    await page.click(CHECKOUT_BUTTON_CSS);

    await page.waitForSelector(ANONYMOUS_EMAIL_INPUT_CSS);
    await page.type(ANONYMOUS_EMAIL_INPUT_CSS, `test_${Math.random().toString(36).substring(7)}@test.com`);
    await Promise.all([
      page.click(CHECKOUT_AUTH_BUTTON_CSS),
      page.waitForNavigation()
    ]);

    await page.waitForSelector(ADD_NEW_ADDRESS_CSS);
    await page.waitFor(2000);
    await page.click(ADD_NEW_ADDRESS_CSS);

    const address = {
      postalCode: '12345',
      province: 'Washington',
      city: 'Seattle',
      country: 'United States',
    } ;
    await addAddress(page, address);
    await page.waitForSelector(CREATED_ADDRESS_METHOD);
    await page.waitFor(3000);

    await page.waitForSelector(ADD_NEW_PAYMENT_CSS);
    await page.click(ADD_NEW_PAYMENT_CSS);

    const paymentMethod = {
      cardType: 'Visa',
      cardHolderName: 'Test User',
      cardNumber: '4111111111111111',
      expiryMonth: '10',
      expiryYear: '2025',
      securityCode: '123',
    };

    await addPaymentMethodToOrder(page, paymentMethod);
    await page.waitForSelector(CREATED_PAYMENT_METHOD);
    await page.waitFor(3000);
    await page.waitForSelector(COMPLETE_ORDER_BUTTON_CSS);
    await page.click(COMPLETE_ORDER_BUTTON_CSS);

    await page.waitForSelector(ORDER_MAIN_CONTAINER_CSS);
    await page.waitForSelector(COMPLETE_ORDER_BUTTON_CSS);
    await page.click(COMPLETE_ORDER_BUTTON_CSS);

    await page.waitForSelector(ORDER_STATUS_CSS);
    const element = await page.$(ORDER_STATUS_CSS);
    const text = await page.evaluate(el => el.textContent, element);

    await browser.close();

    expect(text).toEqual(SUCCESS_ORDER_STATUS);
  }, 80000);

  test('Purchase physical item as an existing registered shopper', async () => {
    const SUCCESS_ORDER_STATUS = 'In Progress';

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-web-security'],
      slowMo: 10,
    });
    const page = await browser.newPage();
    await page.setViewport(desktopViewport);
    await page.goto(APP, {
      timeout: 30000,
      waitUntil: 'domcontentloaded'
    });

    await addProductToCart(page, 'Mens', '', 'Men\'s S/S Hanley');

    await page.waitForSelector(CHECKOUT_BUTTON_CSS);
    await page.click(CHECKOUT_BUTTON_CSS);
    
    await loginUserRegister(page, purchaseTestUser);

    await page.waitForSelector(CART_LINK_CSS);
    await page.click(CART_LINK_CSS);

    await page.waitForSelector(CHECKOUT_BUTTON_CSS);
    await page.click(CHECKOUT_BUTTON_CSS);

    await page.waitForSelector(BILLING_ADDRESS_SELECTORS_REGION_CSS);
    const address = await page.$(CHECKOUT_ADDRESS_SELECTOR_CSS);
    if (!address) {
      await page.waitForSelector(ADD_NEW_ADDRESS_CSS);
      await page.click(ADD_NEW_ADDRESS_CSS);
      const address = {
        postalCode: '12345',
        province: 'Washington',
        city: 'Seattle',
        country: 'United States',
      } ;
      await addAddress(page, address);
      await page.waitForSelector(CREATED_ADDRESS_METHOD);
      await page.waitFor(3000);
    }

    await page.waitForSelector(PAYMENT_METHOD_REGION_CSS);
    const payment = await page.$(PAYMENT_SELECTOR_CSS);

    if (!payment) {
      await page.waitForSelector(ADD_NEW_PAYMENT_CSS);
      await page.click(ADD_NEW_PAYMENT_CSS);

      const paymentMethod = {
        cardType: 'Visa',
        cardHolderName: 'Test User',
        cardNumber: '4111111111111111',
        expiryMonth: '10',
        expiryYear: '2025',
        securityCode: '123',
      };

      await addPaymentMethodToOrder(page, paymentMethod);
      await page.waitForSelector(CREATED_PAYMENT_METHOD);
      await page.waitFor(3000);
    }

    await page.waitForSelector(CHECKOUT_MAIN_CONTAINER_CSS);
    await page.waitForSelector(COMPLETE_ORDER_BUTTON_CSS);
    await page.click(COMPLETE_ORDER_BUTTON_CSS);

    await page.waitForSelector(COMPLETE_ORDER_BUTTON_CSS);
    await page.click(COMPLETE_ORDER_BUTTON_CSS);

    await page.waitFor(5000);
    await page.waitForSelector(PURCHASE_NUMBER_ORDER_CSS);
    const element = await page.$(PURCHASE_NUMBER_ORDER_CSS);
    const purchaseNumber = await page.evaluate(el => el.textContent, element);

    await page.waitForSelector(LOGIN_BUTTON_CSS);
    await page.click(LOGIN_BUTTON_CSS);

    await page.waitForSelector(PURCHASE_HISTORY_ITEM);
    await page.click(PURCHASE_HISTORY_ITEM);

    await page.waitForSelector(PURCHASE_HISTORY_CSS);
    const tdStatus = await page.$(PURCHASE_STATUS_CSS);
    const tdKey = await page.$(PURCHASE_NUMBER_CSS);
    const status = await page.evaluate(el => el.textContent, tdStatus);
    const key = await page.evaluate(el => el.textContent, tdKey);

    await browser.close();

    expect(key).toEqual(purchaseNumber);
    expect(status).toEqual(SUCCESS_ORDER_STATUS);
  }, 60000);

  test('Purchase physical item as an existing shopper', async () => {
    const SUCCESS_ORDER_STATUS = 'In Progress';

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-web-security'],
      slowMo: 20,
    });
    const page = await browser.newPage();
    await page.setViewport(desktopViewport);
    await page.goto(APP, {
      timeout: 30000,
      waitUntil: 'domcontentloaded'
    });

    await loginUser(page, purchaseTestUser);

    await addProductToCart(page, 'Mens', '', 'Men\'s S/S Hanley');

    await page.waitForSelector(CHECKOUT_BUTTON_CSS);
    await page.click(CHECKOUT_BUTTON_CSS);

    await page.waitForSelector(BILLING_ADDRESS_SELECTORS_REGION_CSS);
    const address = await page.$(CHECKOUT_ADDRESS_SELECTOR_CSS);
    if (!address) {
      await page.waitForSelector(ADD_NEW_ADDRESS_CSS);
      await page.click(ADD_NEW_ADDRESS_CSS);

      const address = {
        postalCode: '12345',
        province: 'Washington',
        city: 'Seattle',
        country: 'United States',
      } ;
      await addAddress(page, address);
      await page.waitForSelector(CREATED_ADDRESS_METHOD);
      await page.waitFor(3000);
    }

    await page.waitForSelector(PAYMENT_METHOD_REGION_CSS);
    const payment = await page.$(PAYMENT_SELECTOR_CSS);
    if (!payment) {
      await page.waitForSelector(ADD_NEW_PAYMENT_CSS);
      await page.click(ADD_NEW_PAYMENT_CSS);

      const paymentMethod = {
        cardType: 'Visa',
        cardHolderName: 'Test User',
        cardNumber: '4111111111111111',
        expiryMonth: '10',
        expiryYear: '2025',
        securityCode: '123',
      };

      await addPaymentMethodToOrder(page, paymentMethod);
      await page.waitForSelector(CREATED_PAYMENT_METHOD);
      await page.waitFor(3000);
    }

    await page.waitForSelector(COMPLETE_ORDER_BUTTON_CSS);
    await page.click(COMPLETE_ORDER_BUTTON_CSS);

    await page.waitForSelector(ORDER_MAIN_CONTAINER);
    await page.waitForSelector(COMPLETE_ORDER_BUTTON_CSS);
    await page.click(COMPLETE_ORDER_BUTTON_CSS);

    await page.waitForSelector(PURCHASE_NUMBER_ORDER_CSS);
    const element = await page.$(PURCHASE_NUMBER_ORDER_CSS);
    const purchaseNumber = await page.evaluate(el => el.textContent, element);

    await page.waitForSelector(LOGIN_BUTTON_CSS);
    await page.click(LOGIN_BUTTON_CSS);
  
    await page.waitForSelector(PURCHASE_HISTORY_ITEM);
    await page.click(PURCHASE_HISTORY_ITEM);

    await page.waitForSelector(PURCHASE_HISTORY_CSS);
    const tdStatus = await page.$(PURCHASE_STATUS_CSS);
    const tdKey = await page.$(PURCHASE_NUMBER_CSS);
    const status = await page.evaluate(el => el.textContent, tdStatus);
    const key = await page.evaluate(el => el.textContent, tdKey);

    await browser.close();

    expect(key).toEqual(purchaseNumber);
    expect(status).toEqual(SUCCESS_ORDER_STATUS);
  }, 120000);

  test('Purchase physical and digital items as existing shopper', async () => {
    const SUCCESS_ORDER_STATUS = 'In Progress';

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-web-security'],
      slowMo: 10,
    });
    const page = await browser.newPage();
    await page.setViewport(desktopViewport);
    await page.goto(APP, {
      timeout: 30000,
      waitUntil: 'domcontentloaded'
    });

    await loginUser(page, purchaseTestUser);

    await addProductToCart(page, 'Mens', '', 'Wordmark Fitted Hat');
    await addProductToCart(page, 'Mens', '', 'Men\'s S/S Hanley');

    await page.waitForSelector(CHECKOUT_BUTTON_CSS);
    await page.click(CHECKOUT_BUTTON_CSS);

    await page.waitForSelector(BILLING_ADDRESS_SELECTORS_REGION_CSS);
    const address = await page.$(CHECKOUT_ADDRESS_SELECTOR_CSS);
    if (!address) {
      await page.waitForSelector(ADD_NEW_ADDRESS_CSS);
      await page.click(ADD_NEW_ADDRESS_CSS);

      const address = {
        postalCode: '12345',
        province: 'Washington',
        city: 'Seattle',
        country: 'United States',
      } ;
      await addAddress(page, address);
      await page.waitForSelector(CREATED_ADDRESS_METHOD);
      await page.waitFor(3000);
    }

    await page.waitForSelector(PAYMENT_METHOD_REGION_CSS);
    const payment = await page.$(PAYMENT_SELECTOR_CSS);
    if (!payment) {
      await page.waitForSelector(ADD_NEW_PAYMENT_CSS);
      await page.click(ADD_NEW_PAYMENT_CSS);

      const paymentMethod = {
        cardType: 'Visa',
        cardHolderName: 'Test User',
        cardNumber: '4111111111111111',
        expiryMonth: '10',
        expiryYear: '2025',
        securityCode: '123',
      };

      await addPaymentMethodToOrder(page, paymentMethod);
      await page.waitForSelector(CREATED_PAYMENT_METHOD);
      await page.waitFor(3000);
    }

    await page.waitForSelector(COMPLETE_ORDER_BUTTON_CSS);
    await page.click(COMPLETE_ORDER_BUTTON_CSS);

    await page.waitForSelector(ORDER_MAIN_CONTAINER);
    await page.waitForSelector(COMPLETE_ORDER_BUTTON_CSS);
    await page.click(COMPLETE_ORDER_BUTTON_CSS);

    await page.waitForSelector(PURCHASE_NUMBER_ORDER_CSS);
    const element = await page.$(PURCHASE_NUMBER_ORDER_CSS);
    const purchaseNumber = await page.evaluate(el => el.textContent, element);

    await page.waitForSelector(LOGIN_BUTTON_CSS);
    await page.click(LOGIN_BUTTON_CSS);

    await page.waitForSelector(PURCHASE_HISTORY_ITEM);
    await page.click(PURCHASE_HISTORY_ITEM);

    await page.waitForSelector(PURCHASE_HISTORY_CSS);
    const tdStatus = await page.$(PURCHASE_STATUS_CSS);
    const tdKey = await page.$(PURCHASE_NUMBER_CSS);
    const status = await page.evaluate(el => el.textContent, tdStatus);
    const key = await page.evaluate(el => el.textContent, tdKey);

    await browser.close();

    expect(key).toEqual(purchaseNumber);
    expect(status).toEqual(SUCCESS_ORDER_STATUS);
  }, 60000);

  test('Cart merge from anonymous shopper to registered shopper', async () => {
    const SUCCESS_ORDER_STATUS = 'In Progress';

    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      slowMo: 10,
    });
    const page = await browser.newPage();
    await page.setViewport(desktopViewport);
    await page.goto(APP, {
      timeout: 30000,
      waitUntil: 'domcontentloaded'
    });

    const products = [
      {
        productCategory: 'Mens',
        productSubCategory: '',
        productName: 'Wordmark Fitted Hat'
      },
      {
        productCategory: 'Womens',
        productSubCategory: '',
        productName: 'Structured Hat'
      },
      {
        productCategory: 'X-Class',
        productSubCategory: 'Visual',
        productName: 'Carbon Fiber Center Console Trim'
      }
    ];
    for (let item of products) {
      await addProductToCart(page, item.productCategory, item.productSubCategory, item.productName);
    }

    const expectedChartItems = products.map(product => product.productName);
    expect(await getChartItems(page)).toEqual(expectedChartItems);

    await loginUser(page, purchaseTestUser);

    await page.waitForSelector(CART_LINK_CSS);
    await page.click(CART_LINK_CSS);

    expect(await getChartItems(page)).toEqual(expectedChartItems);

    const additionalProduct = {
      productCategory: 'Mens',
      productSubCategory: '',
      productName: 'Men\'s Tech Vest'
    };
    await addProductToCart(page, additionalProduct.productCategory, additionalProduct.productSubCategory, additionalProduct.productName);
    expectedChartItems.push(additionalProduct.productName);

    expect(await getChartItems(page)).toEqual(expectedChartItems);

    await page.waitForSelector(CHECKOUT_BUTTON_CSS);
    await page.click(CHECKOUT_BUTTON_CSS);

    await page.waitForSelector(COMPLETE_ORDER_BUTTON_CSS);
    await page.click(COMPLETE_ORDER_BUTTON_CSS);

    await page.waitForSelector(ORDER_MAIN_CONTAINER);
    await page.waitForSelector(COMPLETE_ORDER_BUTTON_CSS);
    await page.click(COMPLETE_ORDER_BUTTON_CSS);

    await page.waitForSelector(PURCHASE_NUMBER_ORDER_CSS);
    const element = await page.$(PURCHASE_NUMBER_ORDER_CSS);
    const purchaseNumber = await page.evaluate(el => el.textContent, element);

    await page.waitForSelector(LOGIN_BUTTON_CSS);
    await page.click(LOGIN_BUTTON_CSS);

    await page.waitForSelector(PURCHASE_HISTORY_ITEM);
    await page.click(PURCHASE_HISTORY_ITEM);

    await page.waitForSelector(PURCHASE_HISTORY_CSS);
    const tdStatus = await page.$(PURCHASE_STATUS_CSS);
    const tdKey = await page.$(PURCHASE_NUMBER_CSS);
    const status = await page.evaluate(el => el.textContent, tdStatus);
    const key = await page.evaluate(el => el.textContent, tdKey);

    await browser.close();

    expect(key).toEqual(purchaseNumber);
    expect(status).toEqual(SUCCESS_ORDER_STATUS);
  }, 120000);

  test('Purchase multi-sku item as a registered shopper', async () => {
    const SUCCESS_ORDER_STATUS = 'In Progress';

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-web-security'],
      slowMo: 10,
    });
    const page = await browser.newPage();
    await page.setViewport(desktopViewport);
    await page.goto(APP, {
      timeout: 30000,
      waitUntil: 'domcontentloaded'
    });

    await addProductToCart(page, 'Mens', '', 'Men\'s S/S Hanley');

    await page.waitForSelector(CART_LINK_CSS);
    await page.click(CART_LINK_CSS);

    await page.waitForSelector(CHECKOUT_BUTTON_CSS);
    await page.click(CHECKOUT_BUTTON_CSS);

    await page.waitForSelector(REGISTER_BUTTON_CSS);
    await page.click(REGISTER_BUTTON_CSS);

    const userInfo = {
      firstName: 'Test',
      lastName: 'Test',
      email: `test_${Math.random().toString(36).substring(7)}@test.com`,
      password: '12345678_test',
    } ;
    await registerUser(page, userInfo);

    await page.waitForSelector(ADD_NEW_ADDRESS_CSS);
    await page.waitFor(2000);
    await page.click(ADD_NEW_ADDRESS_CSS);

    const address = {
      postalCode: '12345',
      province: 'Washington',
      city: 'Seattle',
      country: 'United States',
    } ;
    await addAddress(page, address);
    await page.waitForSelector(CREATED_ADDRESS_METHOD);
    await page.waitFor(3000);

    await page.waitForSelector(ADD_NEW_PAYMENT_CSS);
    await page.click(ADD_NEW_PAYMENT_CSS);

    const paymentMethod = {
      cardType: 'Visa',
      cardHolderName: 'Test User',
      cardNumber: '4111111111111111',
      expiryMonth: '10',
      expiryYear: '2025',
      securityCode: '123',
    };

    await addPaymentMethodToOrder(page, paymentMethod);
    await page.waitForSelector(CREATED_PAYMENT_METHOD);
    await page.waitFor(3000);
    await page.waitForSelector(COMPLETE_ORDER_BUTTON_CSS);
    await page.click(COMPLETE_ORDER_BUTTON_CSS);

    await page.waitForSelector(ORDER_MAIN_CONTAINER_CSS);
    await page.waitForSelector(COMPLETE_ORDER_BUTTON_CSS);
    await page.click(COMPLETE_ORDER_BUTTON_CSS);
  
    await page.waitForSelector(PURCHASE_NUMBER_ORDER_CSS);
    const element = await page.$(PURCHASE_NUMBER_ORDER_CSS);
    const purchaseNumber = await page.evaluate(el => el.textContent, element);

    await page.waitForSelector(LOGIN_BUTTON_CSS);
    await page.click(LOGIN_BUTTON_CSS);

    await page.waitForSelector(PURCHASE_HISTORY_ITEM);
    await page.click(PURCHASE_HISTORY_ITEM);

    await page.waitForSelector(PURCHASE_HISTORY_CSS);
    const tdStatus = await page.$(PURCHASE_STATUS_CSS);
    const tdKey = await page.$(PURCHASE_NUMBER_CSS);
    const status = await page.evaluate(el => el.textContent, tdStatus);
    const key = await page.evaluate(el => el.textContent, tdKey);

    await browser.close();

    expect(key).toEqual(purchaseNumber);
    expect(status).toEqual(SUCCESS_ORDER_STATUS);
  }, 60000);
});
