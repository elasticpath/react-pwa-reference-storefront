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

const userData = {
  username: 'john@ep.com',
  password: 'password',
  firstname: 'john2',
  lastname: 'smith2',
};

const userInfo = {
  firstName: 'Test',
  lastName: 'Test',
  email: `test_${Math.random().toString(36).substring(7)}@test.com`,
  password: '12345678_test',
} ;

const address = {
  postalCode: '12345',
  province: 'Washington',
  city: 'Seattle',
  country: 'United States',
} ;

const paymentMethod = {
  cardType: 'Visa',
  cardHolderName: 'Test User',
  cardNumber: '411111111111111',
  expiryMonth: '10',
  expiryYear: '2025',
  securityCode: '111',
};

const host = process.env.TEST_HOST;
const APP = host || 'http://localhost:8080/';
const desktopViewport = {
  width: 1500,
  height: 700,
};

const LOGGED_IN_BUTTON = 'button[id="header_navbar_loggedIn_button"]';
const DROPDOWN_LOGGED_IN_BUTTON = '.dropdown-toggle#header_navbar_loggedIn_button';
const REGISTER_BUTTON = 'button[id="login_modal_register_button"]';
const MY_PROFILE = 'span[id="header_navbar_login_menu_profile_link"]';
const PURCHASE_HISTORY = "div[data-region='profilePurchaseHistoryRegion']";
const EDIT_PERSONAL_INFO_BUTTON = 'button.profile-personal-info-edit-btn';
const EDIT_PERSONAL_INFO_FIELDS = 'div[data-region="componentAddressFormRegion"]';
const EDIT_FIRST_NAME = 'input[id="registration_form_firstName"]';
const EDIT_LAST_NAME = 'input[id="registration_form_lastName"]';
const SAVE_PERSONAL_INFO_BUTTON = 'button[data-el-label="addressForm.save"]';
const CHECKING_FIRST_NAME = 'span[id="profile_personal_info_givenName"]';
const ADD_NEW_ADDRESS = '.profile-new-address-btn';
const ADD_NEW_PAYMENT_METHOD = '.new-payment-btn';
const FORM_EMAIL_USER_NAME = '#registration_form_emailUsername';
const FORM_PASSWORD = '#registration_form_password';
const FORM_CONFIRM_PASSWORD = '#registration_form_passwordConfirm';
const FORM_SUBMIT_BUTTON = '#registration_form_register_button';
const FIRST_NAME = '#registration_form_firstName';
const LAST_NAME = '#registration_form_lastName';
const STREET_ADDRESS = '#StreetAddress';
const CITY = '#City';
const COUNTRY = '#Country';
const PROVINCE = '#Region';
const POSTAL_CODE = '#PostalCode';
const SAVE_BUTTON = '.address-save-btn';
const CARD_TYPE = "#CardType";
const CARD_HOLDER_NAME = "#CardHolderName";
const CARD_NUMBER = "#CardNumber";
const EXPIRY_MONTH = "#ExpiryMonth";
const EXPIRY_YEAR = "#ExpiryYear";
const SECURITY_CODE = "#SecurityCode";
const SAVE_TO_PROFILE = "#saveToProfile";
const CONTINUE_BUTTON = "button.payment-save-btn";
const ADDRESS_NAME = ".address-name";

const EXPECTED_FIRST_NAME = 'john2';
const EXPECTED_ADDRESS_NAME= 'Test User';

async function loginUser(page) {
  const userInfo = {
    firstName: 'john2',
    lastName: 'smith2',
    username: `john2@ep.com`,
    password: 'password',
  };
  const LOGIN_FEEDBACK = 'div[data-region="authLoginFormFeedbackRegion"]';
  const REGISTER_BUTTON_CSS = "#login_modal_register_button";
  const HOME_PAGE_CSS = 'div.home-page-component';

  const LOGGED_IN_BUTTON = '#header_navbar_loggedIn_button';
  const LOGIN_USERNAME_INPUT = '#login_modal_username_input';
  const LOGIN_PASSWORD_INPUT = '#login_modal_password_input';
  const LOGIN_BUTTON = '#login_modal_login_button';

  const FORM_FIRST_NAME = '#registration_form_firstName';
  const FORM_LAST_NAME = '#registration_form_lastName';
  const FORM_EMAIL_USER_NAME = '#registration_form_emailUsername';
  const FORM_PASSWORD = '#registration_form_password';
  const FORM_CONFIRM_PASSWORD = '#registration_form_passwordConfirm';
  const FORM_SUBMIT_BUTTON = '#registration_form_register_button';

  await page.waitForSelector(LOGGED_IN_BUTTON);
  await page.click(LOGGED_IN_BUTTON);

  await page.waitForSelector(LOGIN_USERNAME_INPUT);
  await page.type(LOGIN_USERNAME_INPUT, userInfo.username);

  await page.waitForSelector(LOGIN_PASSWORD_INPUT);
  await page.type(LOGIN_PASSWORD_INPUT, userInfo.password);

  await page.waitForSelector(LOGIN_BUTTON);
  await Promise.all([
    page.click(LOGIN_BUTTON),
  ]);
  await page.waitFor(5000);

  const feedbackElement = await page.$(LOGIN_FEEDBACK);
  let feedbackText = '';
  if (feedbackElement) {
    feedbackText = await page.evaluate(el => el.textContent, feedbackElement);
  }
  if (feedbackText){
    await page.waitForSelector(REGISTER_BUTTON_CSS);
    await page.click(REGISTER_BUTTON_CSS);
    await page.waitForSelector(FORM_FIRST_NAME);
    await page.type(FORM_FIRST_NAME, userInfo.firstName);
    await page.type(FORM_LAST_NAME, userInfo.lastName);
    await page.type(FORM_EMAIL_USER_NAME, userInfo.username);
    await page.type(FORM_PASSWORD, userInfo.password);
    await page.type(FORM_CONFIRM_PASSWORD, userInfo.password);

    await page.click(FORM_SUBMIT_BUTTON);
    await page.waitForSelector(HOME_PAGE_CSS);
  }
  else {
    await page.waitForSelector(HOME_PAGE_CSS);
  }
}

describe('Profile', () => {
  test('Navigate Profile', async () => {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      slowMo: 20,
    });
    const page = await browser.newPage();

    page.emulate({
      viewport: desktopViewport,
      userAgent: '',
    });
    await page.goto(APP);

    // When I login as following registered shopper
    await loginUser(page);

    // When I navigate to the profile page
    await page.waitForSelector(DROPDOWN_LOGGED_IN_BUTTON);
    await page.click(DROPDOWN_LOGGED_IN_BUTTON);
    await page.waitForSelector(MY_PROFILE);
    await page.click(MY_PROFILE);

    // Then I can see my purchase history
    await page.waitForSelector(PURCHASE_HISTORY);

    await browser.close();
  }, 20000);

  test('Update Personal Info', async () => {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      slowMo: 20,
    });
    const page = await browser.newPage();

    page.emulate({
      viewport: desktopViewport,
      userAgent: '',
    });
    await page.goto(APP);

    // When I login as following registered shopper
    await loginUser(page);

    // When I navigate to the profile page
    await page.waitForSelector(DROPDOWN_LOGGED_IN_BUTTON);
    await page.click(DROPDOWN_LOGGED_IN_BUTTON);
    await page.waitForSelector(MY_PROFILE);
    await page.click(MY_PROFILE);

    // And I click the edit personal info button
    await page.waitForSelector(EDIT_PERSONAL_INFO_BUTTON);
    await page.click(EDIT_PERSONAL_INFO_BUTTON);

    // Then I can update my personal info
    await page.waitForSelector(EDIT_PERSONAL_INFO_FIELDS);

    // When I update my personal info to the following
    page.$eval(EDIT_FIRST_NAME, el => el.value = '');
    page.$eval(EDIT_LAST_NAME, el => el.value = '');
    await page.type(EDIT_FIRST_NAME, userData.firstname);
    await page.type(EDIT_LAST_NAME, userData.lastname);
    await page.click(SAVE_PERSONAL_INFO_BUTTON);

    // Then My personal info should be updated
    await page.waitForSelector(CHECKING_FIRST_NAME);
    const element = await page.$(CHECKING_FIRST_NAME);
    const text = await page.evaluate(el => el.textContent, element);
    expect(text).toEqual(EXPECTED_FIRST_NAME);

    await browser.close();
  }, 30000);

  test('Create new user with Address and Payment Method', async () => {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      slowMo: 20,
    });
    const page = await browser.newPage();

    page.emulate({
      viewport: desktopViewport,
      userAgent: '',
    });
    await page.goto(APP);

    // When I register a new user
    await page.waitForSelector(LOGGED_IN_BUTTON);
    await page.click(LOGGED_IN_BUTTON);
    await page.waitForSelector(REGISTER_BUTTON);
    await page.click(REGISTER_BUTTON);

    await page.waitForSelector(FIRST_NAME);
    await page.type(FIRST_NAME, userInfo.firstName);
    await page.type(LAST_NAME, userInfo.lastName);
    await page.type(FORM_EMAIL_USER_NAME, userInfo.email);
    await page.type(FORM_PASSWORD, userInfo.password);
    await page.type(FORM_CONFIRM_PASSWORD, userInfo.password);

    // submit form
    await page.click(FORM_SUBMIT_BUTTON);

    // When I navigate to the profile page
    await page.waitForSelector(DROPDOWN_LOGGED_IN_BUTTON);
    await page.click(DROPDOWN_LOGGED_IN_BUTTON);
    await page.waitForSelector(MY_PROFILE);
    await page.click(MY_PROFILE);

    // And I click to add address
    await page.waitForSelector(ADD_NEW_ADDRESS);
    await page.click(ADD_NEW_ADDRESS);

    await page.waitForSelector(FIRST_NAME);
    await page.type(FIRST_NAME, 'Test');
    await page.type(LAST_NAME, 'User');
    await page.type(STREET_ADDRESS, '555 Main Street');
    await page.type(CITY, address.city);
    await page.type(COUNTRY, address.country);
    await page.type(PROVINCE, address.province);
    await page.type(POSTAL_CODE, address.postalCode);

    // submit form
    await page.click(SAVE_BUTTON);

    // And I click to add payment method
    await page.waitForSelector(ADD_NEW_PAYMENT_METHOD);
    await page.click(ADD_NEW_PAYMENT_METHOD);

    await page.waitForSelector(CARD_TYPE);
    await page.type(CARD_TYPE, paymentMethod.cardType);
    await page.type(CARD_HOLDER_NAME, paymentMethod.cardHolderName);
    await page.type(CARD_NUMBER, paymentMethod.cardNumber);
    await page.type(EXPIRY_MONTH, paymentMethod.expiryMonth);
    await page.type(EXPIRY_YEAR, paymentMethod.expiryYear);
    await page.type(SECURITY_CODE, paymentMethod.securityCode);
    await page.click(SAVE_TO_PROFILE);
    await page.click(CONTINUE_BUTTON);

    // When I navigate to the profile page
    await page.waitForSelector(ADD_NEW_PAYMENT_METHOD);
    await page.click(DROPDOWN_LOGGED_IN_BUTTON);
    await page.waitForSelector(MY_PROFILE);
    await page.click(MY_PROFILE);

    // Then I can see my addresses
    await page.waitForSelector(ADDRESS_NAME);
    const element = await page.$(ADDRESS_NAME);
    const text = await page.evaluate(el => el.textContent, element);
    expect(text).toEqual(EXPECTED_ADDRESS_NAME);

    await browser.close();
  }, 35000);
});
