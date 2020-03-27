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

module.exports = {
  async loginUserRegister(page, user) {
    const LOGIN_USERNAME_INPUT_CSS = '#registration_form_emailUsername';
    const LOGIN_PASSWORD_INPUT_CSS = '#registration_form_password';
    const LOGIN_BUTTON_CSS = 'button[data-el-label="checkoutAuthOption.login"]';
    const LOGIN_FEEDBACK_CSS = 'div[data-region="authLoginFormFeedbackRegion"]';
    const REGISTER_BUTTON_CSS = 'button[class="ep-btn primary wide checkout-auth-option-register-btn"]';
    const HOME_PAGE_CSS = 'div.home-page-component';
    const FORM_FIRST_NAME_CSS = '#registration_form_firstName';
    const FORM_LAST_NAME_CSS = '#registration_form_lastName';
    const FORM_EMAIL_USER_NAME_CSS = '#registration_form_emailUsername';
    const FORM_PASSWORD_CSS = '#registration_form_password';
    const FORM_CONFIRM_PASSWORD_CSS = '#registration_form_passwordConfirm';
    const FORM_SUBMIT_BUTTON_CSS = '#registration_form_register_button';

    await page.waitFor(3000);
    await page.waitForSelector(LOGIN_USERNAME_INPUT_CSS);
    await page.type(LOGIN_USERNAME_INPUT_CSS, user.email);

    await page.waitForSelector(LOGIN_PASSWORD_INPUT_CSS);
    await page.type(LOGIN_PASSWORD_INPUT_CSS, user.password);

    await page.waitForSelector(LOGIN_BUTTON_CSS);
    await page.click(LOGIN_BUTTON_CSS);

    await page.waitFor(3000);

    const feedbackElement = await page.$(LOGIN_FEEDBACK_CSS);
    let feedbackText = '';
    if (feedbackElement) {
      feedbackText = await page.evaluate(el => el.textContent, feedbackElement);
    }
    if (feedbackText) {
      const firstName = user.firstName || 'Test';
      const lastName = user.lastName || 'Test';

      await page.waitForSelector(REGISTER_BUTTON_CSS);
      await page.click(REGISTER_BUTTON_CSS);
      await page.waitFor(3000);
      await page.waitForSelector(FORM_FIRST_NAME_CSS);
      await page.type(FORM_FIRST_NAME_CSS, firstName);
      await page.type(FORM_LAST_NAME_CSS, lastName);
      await page.type(FORM_EMAIL_USER_NAME_CSS, user.email);
      await page.type(FORM_PASSWORD_CSS, user.password);
      await page.type(FORM_CONFIRM_PASSWORD_CSS, user.password);

      await page.click(FORM_SUBMIT_BUTTON_CSS);
      await page.waitForSelector(HOME_PAGE_CSS);
    }
  },

  async addProductToCart(page, productCategory, productSubCategory, productName) {
    const PARENT_CATEGORY_CSS = `.app-header-navigation-component li[data-name="${productCategory}"]`;
    const SUB_CATEGORY_CSS = `${PARENT_CATEGORY_CSS} > .dropdown-menu > li > a[title="${productSubCategory}"]`;
    const PRODUCT_CSS = '.product-list-container .category-items-listing';
    const ADD_TO_CART_BUTTON_CSS = 'button[id="product_display_item_add_to_cart_button"]';
    const CART_SELECTION_DROPDOWN_CSS = 'button[id="product_display_item_add_to_cart_button-dropdown"]';
    const CART_SELECTION_DROPDOWN_SHOW_CSS = 'button[id="product_display_item_add_to_cart_button-dropdown"][aria-expanded="true"]';
    const CART_SELECTION_DROPDOWN_ITEM_CSS = 'form.itemdetail-addtocart-form.form-horizontal > div.form-group-submit > div > div > div > button:nth-child(1)';
    const CART_LIST_CSS = 'div[data-region="mainCartRegion"]';
    const CART_LINK_CSS = '.cart-link';
    const CART_SUCCESS_POPUP = 'div[data-region="cart_success_popup"].show';

    page.setDefaultNavigationTimeout(0);
    await page.waitForSelector(PARENT_CATEGORY_CSS);
    if (productSubCategory) {
      await page.click(PARENT_CATEGORY_CSS);
    } else {
      await Promise.all([
        page.click(PARENT_CATEGORY_CSS),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
      ]);
    }

    if (productSubCategory) {
      await page.waitForSelector(SUB_CATEGORY_CSS);
      await Promise.all([
        page.click(SUB_CATEGORY_CSS),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
      ]);
    }

    await page.waitFor(5000);
    await page.waitForSelector(PRODUCT_CSS);
    const productLink = await page.$x(`//a[contains(text(), "${productName}")]`);

    if (productLink.length > 0) {
      await productLink[0].click();
    } else {
      throw new Error('Product not found');
    }
    await page.waitFor(5000);
    if (await page.$(CART_SELECTION_DROPDOWN_CSS) !== null) {
      await page.click(CART_SELECTION_DROPDOWN_CSS);
      await page.waitForSelector(CART_SELECTION_DROPDOWN_SHOW_CSS);
      await page.waitFor(1000);
      await page.waitForSelector(CART_SELECTION_DROPDOWN_ITEM_CSS);
      await page.click(CART_SELECTION_DROPDOWN_ITEM_CSS);
      await page.waitFor(CART_SUCCESS_POPUP);
      await page.waitForSelector(CART_LINK_CSS);
      await page.click(CART_LINK_CSS);
    } else {
      await page.waitForSelector(ADD_TO_CART_BUTTON_CSS);
      await page.click(ADD_TO_CART_BUTTON_CSS);
    }
    await page.waitFor(5000);
    await page.waitForSelector(CART_LIST_CSS);
  },

  async registerUser(page, userInfo) {
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
  },

  async addPaymentMethodToOrder(page, paymentMethod) {
    const CARD_TYPE = '#CardType';
    const CARD_HOLDER_NAME = '#CardHolderName';
    const CARD_NUMBER = '#CardNumber';
    const EXPIRY_MONTH = '#ExpiryMonth';
    const EXPIRY_YEAR = '#ExpiryYear';
    const SECURITY_CODE = '#SecurityCode';
    const CONTINUE_BUTTON = 'button.payment-save-btn';

    await page.waitForSelector(CARD_TYPE);
    await page.type(CARD_TYPE, paymentMethod.cardType);
    await page.type(CARD_HOLDER_NAME, paymentMethod.cardHolderName);
    await page.type(CARD_NUMBER, paymentMethod.cardNumber);
    await page.type(EXPIRY_MONTH, paymentMethod.expiryMonth);
    await page.type(EXPIRY_YEAR, paymentMethod.expiryYear);
    await page.type(SECURITY_CODE, paymentMethod.securityCode);
    await page.waitFor(3000);
    await page.click(CONTINUE_BUTTON);
  },

  async addPaymentMethodToProfile(page, paymentMethod) {
    const CARD_TYPE = '#CardType';
    const CARD_HOLDER_NAME = '#CardHolderName';
    const CARD_NUMBER = '#CardNumber';
    const EXPIRY_MONTH = '#ExpiryMonth';
    const EXPIRY_YEAR = '#ExpiryYear';
    const SECURITY_CODE = '#SecurityCode';
    const CONTINUE_BUTTON = 'button.payment-save-btn';

    await page.waitForSelector(CARD_TYPE);
    await page.type(CARD_TYPE, paymentMethod.cardType);
    await page.type(CARD_HOLDER_NAME, paymentMethod.cardHolderName);
    await page.type(CARD_NUMBER, paymentMethod.cardNumber);
    await page.type(EXPIRY_MONTH, paymentMethod.expiryMonth);
    await page.type(EXPIRY_YEAR, paymentMethod.expiryYear);
    await page.type(SECURITY_CODE, paymentMethod.securityCode);
    await page.click(CONTINUE_BUTTON);
  },

  async addAddress(page, address) {
    const FIRST_NAME = '#registration_form_firstName';
    const LAST_NAME = '#registration_form_lastName';
    const STREET_ADDRESS = '#StreetAddress';
    const CITY = '#City';
    const COUNTRY = '#Country';
    const PROVINCE = '#Region';
    const POSTAL_CODE = '#PostalCode';
    const SAVE_BUTTON = 'button.address-save-btn';

    await page.waitFor(2000);
    await page.waitForSelector(FIRST_NAME);
    await page.type(FIRST_NAME, 'Test');
    await page.type(LAST_NAME, 'User');
    await page.type(STREET_ADDRESS, '555 Main Street');
    await page.type(CITY, address.city);
    await page.type(COUNTRY, address.country);
    await page.type(PROVINCE, address.province);
    await page.type(POSTAL_CODE, address.postalCode);

    await page.click(SAVE_BUTTON);
  },

  async loginUser(page, user) {
    const LOGIN_FEEDBACK = 'div[data-region="authLoginFormFeedbackRegion"]';
    const REGISTER_BUTTON_CSS = '#login_modal_register_button';
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

    await page.waitFor(3000);
    await page.waitForSelector(LOGGED_IN_BUTTON);
    await page.click(LOGGED_IN_BUTTON);

    await page.waitForSelector(LOGIN_USERNAME_INPUT);
    await page.waitForSelector(LOGIN_USERNAME_INPUT);
    await page.type(LOGIN_USERNAME_INPUT, user.email);

    await page.waitForSelector(LOGIN_PASSWORD_INPUT);
    await page.type(LOGIN_PASSWORD_INPUT, user.password);

    await page.waitForSelector(LOGIN_BUTTON);
    await page.click(LOGIN_BUTTON);
    await page.waitFor(3000);

    const feedbackElement = await page.$(LOGIN_FEEDBACK);
    let feedbackText = '';
    if (feedbackElement) {
      feedbackText = await page.evaluate(el => el.textContent, feedbackElement);
    }
    if (feedbackText) {
      const firstName = user.firstName || 'Test';
      const lastName = user.lastName || 'Test';

      await page.waitForSelector(REGISTER_BUTTON_CSS);
      await page.click(REGISTER_BUTTON_CSS);
      await page.waitFor(3000);
      await page.waitForSelector(FORM_FIRST_NAME);
      await page.type(FORM_FIRST_NAME, firstName);
      await page.type(FORM_LAST_NAME, lastName);
      await page.type(FORM_EMAIL_USER_NAME, user.email);
      await page.type(FORM_PASSWORD, user.password);
      await page.type(FORM_CONFIRM_PASSWORD, user.password);

      await Promise.all([
        page.click(FORM_SUBMIT_BUTTON),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
      ]);
    }
  },
};
