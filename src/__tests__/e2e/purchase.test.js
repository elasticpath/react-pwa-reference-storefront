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

async function addProductToCart(page, productCategory, productSubCategory, productName) {
  const PARENT_CATEGORY_CSS = `.app-header-navigation-component li[data-name="${productCategory}"]`;
  const SUB_CATEGORY_CSS = `${PARENT_CATEGORY_CSS} > .dropdown-menu > li > a[title="${productSubCategory}"]`;
  const PRODUCT_CSS = '.product-list-container .category-items-listing .category-item-container';
  const ADD_TO_CART_BUTTON_CSS = 'button[id="product_display_item_add_to_cart_button"]';
  const CART_LIST = 'div[data-region="mainCartRegion"]';
  
  await page.waitForSelector(PARENT_CATEGORY_CSS);
  await page.click(PARENT_CATEGORY_CSS);
  
  if(productSubCategory) {
    await page.waitForSelector(SUB_CATEGORY_CSS);
    await page.click(SUB_CATEGORY_CSS);
  }
  
  await page.waitForSelector(PRODUCT_CSS);
  const productLink = await page.$x(`//a[contains(text(), "${productName}")]`);
  
  if (productLink.length > 0) {
    await productLink[0].click();
  } else {
    throw new Error("Product not found");
  }
  
  await page.waitForSelector(ADD_TO_CART_BUTTON_CSS);
  await page.click(ADD_TO_CART_BUTTON_CSS);
  await page.waitForSelector(CART_LIST);
}

async function registerUser(page, userInfo) {
  const FORM_FIRST_NAME = '#registration_form_firstName';
  const FORM_LAST_NAME = '#registration_form_lastName';
  const FORM_EMAIL_USER_NAME = '#registration_form_emailUsername';
  const FORM_PASSWORD = '#registration_form_password';
  const FORM_CONFIRM_PASSWORD = '#registration_form_passwordConfirm';
  const FORM_SUBMIT_BUTTON = '#registration_form_register_button';
  
  await page.waitForSelector(FORM_FIRST_NAME);
  await page.type(FORM_FIRST_NAME, userInfo.firstName);
  await page.type(FORM_LAST_NAME, userInfo.lastName);
  await page.type(FORM_EMAIL_USER_NAME, userInfo.email);
  await page.type(FORM_PASSWORD, userInfo.password);
  await page.type(FORM_CONFIRM_PASSWORD, userInfo.password);
  
  await page.click(FORM_SUBMIT_BUTTON);
}

async function addPaymentMethod(page, paymentMethod) {
  const CARD_TYPE = "#CardType";
  const CARD_HOLDER_NAME = "#CardHolderName";
  const CARD_NUMBER = "#CardNumber";
  const EXPIRY_MONTH = "#ExpiryMonth";
  const EXPIRY_YEAR = "#ExpiryYear";
  const SECURITY_CODE = "#SecurityCode";
  const SAVE_TO_PROFILE = "#saveToProfile";
  const CONTINUE_BUTTON = "button.payment-save-btn";
  
  await page.waitForSelector(CARD_TYPE);
  await page.type(CARD_TYPE, paymentMethod.cardType);
  await page.type(CARD_HOLDER_NAME, paymentMethod.cardHolderName);
  await page.type(CARD_NUMBER, paymentMethod.cardNumber);
  await page.type(EXPIRY_MONTH, paymentMethod.expiryMonth);
  await page.type(EXPIRY_YEAR, paymentMethod.expiryYear);
  await page.type(SECURITY_CODE, paymentMethod.securityCode);
  await page.click(SAVE_TO_PROFILE);
  await page.click(CONTINUE_BUTTON);
}

async function addAddress(page, address) {
  const FIRST_NAME = '#registration_form_firstName';
  const LAST_NAME = '#registration_form_lastName';
  const STREET_ADDRESS = '#StreetAddress';
  const CITY = '#City';
  const COUNTRY = '#Country';
  const PROVINCE = '#Region';
  const POSTAL_CODE = '#PostalCode';
  const SAVE_BUTTON = 'button.address-save-btn';
  
  await page.waitForSelector(FIRST_NAME);
  await page.type(FIRST_NAME, 'Test');
  await page.type(LAST_NAME, 'User');
  await page.type(STREET_ADDRESS, '555 Main Street');
  await page.type(CITY, address.city);
  await page.type(COUNTRY, address.country);
  await page.type(PROVINCE, address.province);
  await page.type(POSTAL_CODE, address.postalCode);
  
  await page.click(SAVE_BUTTON);
}

async function loginUser(page, userInfo) {
  const LOGGED_IN_BUTTON = '#header_navbar_loggedIn_button';
  const LOGIN_USERNAME_INPUT = '#login_modal_username_input';
  const LOGIN_PASSWORD_INPUT = '#login_modal_password_input';
  const LOGIN_BUTTON = '#login_modal_login_button';
  
  await page.waitForSelector(LOGGED_IN_BUTTON);
  await page.click(LOGGED_IN_BUTTON);
  
  await page.waitForSelector(LOGIN_USERNAME_INPUT);
  await page.type(LOGIN_USERNAME_INPUT, userInfo.username);
  
  await page.waitForSelector(LOGIN_PASSWORD_INPUT);
  await page.type(LOGIN_PASSWORD_INPUT, userInfo.password);
  
  await page.waitForSelector(LOGIN_BUTTON);
  await Promise.all([
    page.click(LOGIN_BUTTON),
    page.waitForNavigation()
  ]);
  
  await page.waitForSelector(HOME_PAGE_CSS);
}

async function loginUserRegister(page, userInfo) {
  const LOGIN_USERNAME_INPUT_CSS = '#registration_form_emailUsername';
  const LOGIN_PASSWORD_INPUT_CSS = '#registration_form_password';
  const LOGIN_BUTTON_CSS = 'button[data-el-label="checkoutAuthOption.login"]';
  
  await page.waitForSelector(LOGIN_USERNAME_INPUT_CSS);
  await page.type(LOGIN_USERNAME_INPUT_CSS, userInfo.username);
  
  await page.waitForSelector(LOGIN_PASSWORD_INPUT_CSS);
  await page.type(LOGIN_PASSWORD_INPUT_CSS, userInfo.password);
  
  await page.waitForSelector(LOGIN_BUTTON_CSS);
  await page.click(LOGIN_BUTTON_CSS);
}

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

const CART_LINK_CSS = '.cart-link';
const HOME_PAGE_CSS = 'div.home-page-component';
const REGISTER_BUTTON_CSS = "div[data-region='checkoutAutRegisterOptionRegion'] button.checkout-auth-option-register-btn";
const CHECKOUT_BUTTON_CSS = "button[class='ep-btn primary wide btn-cmd-checkout']";
const ADD_NEW_ADDRESS_CSS = 'button[class="ep-btn primary wide checkout-new-address-btn"]';
const ADD_NEW_PAYMENT_CSS = 'button[class="ep-btn primary wide checkout-new-payment-btn"]';
const ANONYMOUS_EMAIL_INPUT_CSS = 'div[data-region="anonymousCheckoutFeedbackRegion"] ~div input[id="Email"]';
const CHECKOUT_AUTH_BUTTON_CSS = 'button[class="ep-btn primary wide checkout-auth-option-anonymous-checkout-btn"]';
const COMPLETE_ORDER_BUTTON_CSS = 'button[class="ep-btn primary wide btn-cmd-submit-order"]';
const ORDER_MAIN_CONTAINER_CSS = 'div.order-main-container';
const ORDER_STATUS_CSS = 'td[data-el-value="status"]';
const CHECKOUT_MAIN_CONTAINER_CSS = 'div.checkout-main-container';
const PURCHASE_NUMBER_ORDER_CSS = 'td[data-el-value="purchaseNumber"]';
const LOGIN_BUTTON_CSS = '#header_navbar_loggedIn_button';
const PROFILE_BUTTON_CSS = '.app-login-component .profile-link';
const PURCHASE_HISTORY_CSS = 'div[data-region="profilePurchaseHistoryRegion"]';
const PURCHASE_STATUS_CSS = 'table[class="table table-condensed striped-table"] > tbody > tr > td[data-el-value="purchase.status"]';
const PURCHASE_NUMBER_CSS = 'table[class="table table-condensed striped-table"] > tbody > tr > td[data-el-value="purchase.number"]';
const ORDER_MAIN_CONTAINER = 'div.order-main-container';


describe('Purchase feature', () => {
  
  test('Purchase physical item as a new shopper', async () => {
    const SUCCESS_ORDER_STATUS = 'In Progress';

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      slowMo: 10
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(APP);
    
    await addProductToCart(page, 'M-Class', 'Wheels, Tires, and Tire Covers', 'M Class Red Brake Calipers');

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

    await page.waitForSelector(HOME_PAGE_CSS);
    
    await page.waitForSelector(CART_LINK_CSS);
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

    await page.waitForSelector(ADD_NEW_PAYMENT_CSS);
    await page.click(ADD_NEW_PAYMENT_CSS);

    const paymentMethod = {
      cardType: 'Visa',
      cardHolderName: 'Test User',
      cardNumber: '411111111111111',
      expiryMonth: '10',
      expiryYear: '2025',
      securityCode: '111',
    };

    await addPaymentMethod(page, paymentMethod);

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
  }, 50000);

  test('Purchase physical item as an anonymous shopper', async () => {
    const SUCCESS_ORDER_STATUS = 'In Progress';

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      slowMo: 10
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(APP);
    
    await addProductToCart(page, 'M-Class', 'Wheels, Tires, and Tire Covers', 'M Class Red Brake Calipers');

    await page.waitForSelector(CHECKOUT_BUTTON_CSS);
    await page.click(CHECKOUT_BUTTON_CSS);

    await page.waitForSelector(ANONYMOUS_EMAIL_INPUT_CSS);
    await page.type(ANONYMOUS_EMAIL_INPUT_CSS, `test_${Math.random().toString(36).substring(7)}@test.com`);
    await page.click(CHECKOUT_AUTH_BUTTON_CSS);

    await page.waitForSelector(ADD_NEW_ADDRESS_CSS);
    await page.click(ADD_NEW_ADDRESS_CSS);

    const address = {
      postalCode: '12345',
      province: 'Washington',
      city: 'Seattle',
      country: 'United States',
    } ;
    await addAddress(page, address);

    await page.waitForSelector(ADD_NEW_PAYMENT_CSS);
    await page.click(ADD_NEW_PAYMENT_CSS);

    const paymentMethod = {
      cardType: 'Visa',
      cardHolderName: 'Test User',
      cardNumber: '411111111111111',
      expiryMonth: '10',
      expiryYear: '2025',
      securityCode: '111',
    };

    await addPaymentMethod(page, paymentMethod);

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
  }, 35000);

  test('Purchase physical item as an existing registered shopper', async () => {
    const SUCCESS_ORDER_STATUS = 'In Progress';
    
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      slowMo: 10
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(APP);
    
    await addProductToCart(page, 'Addons', '', '407n Transponder');
    
    await page.waitForSelector(CHECKOUT_BUTTON_CSS);
    await page.click(CHECKOUT_BUTTON_CSS);
    
    const userInfo = {
      username: 'john@ep.com',
      password: 'password'
    };
    await loginUserRegister(page, userInfo);
    
    await page.waitForSelector(CHECKOUT_MAIN_CONTAINER_CSS);
    await page.waitForSelector(COMPLETE_ORDER_BUTTON_CSS);
    await page.click(COMPLETE_ORDER_BUTTON_CSS);
    
    await page.waitForSelector(COMPLETE_ORDER_BUTTON_CSS);
    await page.click(COMPLETE_ORDER_BUTTON_CSS);
    
    await page.waitForSelector(PURCHASE_NUMBER_ORDER_CSS);
    const element = await page.$(PURCHASE_NUMBER_ORDER_CSS);
    const purchaseNumber = await page.evaluate(el => el.textContent, element);
    
    await page.waitForSelector(LOGIN_BUTTON_CSS);
    await page.click(LOGIN_BUTTON_CSS);
    
    await page.waitForSelector(PROFILE_BUTTON_CSS);
    await page.click(PROFILE_BUTTON_CSS);
    
    await page.waitForSelector(PURCHASE_HISTORY_CSS);
    const tdStatus = await page.$(PURCHASE_STATUS_CSS);
    const tdKey = await page.$(PURCHASE_NUMBER_CSS);
    const status = await page.evaluate(el => el.textContent, tdStatus);
    const key = await page.evaluate(el => el.textContent, tdKey);
    
    await browser.close();
    
    expect(key).toEqual(purchaseNumber);
    expect(status).toEqual(SUCCESS_ORDER_STATUS);
  }, 30000);

  test('Purchase physical item as an existing shopper', async () => {
    const SUCCESS_ORDER_STATUS = 'In Progress';

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      slowMo: 10
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(APP);

    const userInfo = {
      username: 'john@ep.com',
      password: 'password'
    };

    await loginUser(page, userInfo);

    await addProductToCart(page, 'Addons', '', '407n Transponder');

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

    await page.waitForSelector(PROFILE_BUTTON_CSS);
    await page.click(PROFILE_BUTTON_CSS);

    await page.waitForSelector(PURCHASE_HISTORY_CSS);
    const tdStatus = await page.$(PURCHASE_STATUS_CSS);
    const tdKey = await page.$(PURCHASE_NUMBER_CSS);
    const status = await page.evaluate(el => el.textContent, tdStatus);
    const key = await page.evaluate(el => el.textContent, tdKey);

    await browser.close();

    expect(key).toEqual(purchaseNumber);
    expect(status).toEqual(SUCCESS_ORDER_STATUS);
  }, 30000);

  test('Purchase physical and digital items as existing shopper', async () => {
    const SUCCESS_ORDER_STATUS = 'In Progress';

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      slowMo: 10
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(APP);

    const userInfo = {
      username: 'john@ep.com',
      password: 'password'
    };

    await loginUser(page, userInfo);

    await addProductToCart(page, 'M-Class', 'Wheels, Tires, and Tire Covers', 'M Class Red Brake Calipers');
    await addProductToCart(page, 'Addons', '', '407n Transponder');

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

    await page.waitForSelector(PROFILE_BUTTON_CSS);
    await page.click(PROFILE_BUTTON_CSS);

    await page.waitForSelector(PURCHASE_HISTORY_CSS);
    const tdStatus = await page.$(PURCHASE_STATUS_CSS);
    const tdKey = await page.$(PURCHASE_NUMBER_CSS);
    const status = await page.evaluate(el => el.textContent, tdStatus);
    const key = await page.evaluate(el => el.textContent, tdKey);

    await browser.close();

    expect(key).toEqual(purchaseNumber);
    expect(status).toEqual(SUCCESS_ORDER_STATUS);
  }, 30000);
  
  test('Cart merge from anonymous shopper to registered shopper', async () => {
    const SUCCESS_ORDER_STATUS = 'In Progress';

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      slowMo: 10
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(APP);

    const products = [
      {
        productCategory: 'M-Class',
        productSubCategory: 'Wheels, Tires, and Tire Covers',
        productName: 'M Class Red Brake Calipers'
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
  
    const userInfo = {
      username: 'john@ep.com',
      password: 'password'
    };

    await loginUser(page, userInfo);
    
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
    
    await page.waitForSelector(PROFILE_BUTTON_CSS);
    await page.click(PROFILE_BUTTON_CSS);
    
    await page.waitForSelector(PURCHASE_HISTORY_CSS);
    const tdStatus = await page.$(PURCHASE_STATUS_CSS);
    const tdKey = await page.$(PURCHASE_NUMBER_CSS);
    const status = await page.evaluate(el => el.textContent, tdStatus);
    const key = await page.evaluate(el => el.textContent, tdKey);
    
    await browser.close();
  
    expect(key).toEqual(purchaseNumber);
    expect(status).toEqual(SUCCESS_ORDER_STATUS);
  }, 30000);
  
  test('Purchase multi-sku item as a registered shopper', async () => {
    const SUCCESS_ORDER_STATUS = 'In Progress';

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      slowMo: 10
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(APP);

    await addProductToCart(page, 'Mens', '', 'Men\'s Soft Shell Jacket');
  
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
  
    await page.waitForSelector(HOME_PAGE_CSS);
  
    await page.waitForSelector(CART_LINK_CSS);
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
  
    await page.waitForSelector(ADD_NEW_PAYMENT_CSS);
    await page.click(ADD_NEW_PAYMENT_CSS);
  
    const paymentMethod = {
      cardType: 'Visa',
      cardHolderName: 'Test User',
      cardNumber: '411111111111111',
      expiryMonth: '10',
      expiryYear: '2025',
      securityCode: '111',
    };
  
    await addPaymentMethod(page, paymentMethod);
  
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

    await page.waitForSelector(PROFILE_BUTTON_CSS);
    await page.click(PROFILE_BUTTON_CSS);

    await page.waitForSelector(PURCHASE_HISTORY_CSS);
    const tdStatus = await page.$(PURCHASE_STATUS_CSS);
    const tdKey = await page.$(PURCHASE_NUMBER_CSS);
    const status = await page.evaluate(el => el.textContent, tdStatus);
    const key = await page.evaluate(el => el.textContent, tdKey);
    
    await browser.close();

    expect(key).toEqual(purchaseNumber);
    expect(status).toEqual(SUCCESS_ORDER_STATUS);
  }, 30000);
});
