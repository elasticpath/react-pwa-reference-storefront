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

package com.elasticpath.selenium.pages;

import static org.assertj.core.api.Assertions.assertThat;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import com.elasticpath.util.CustomerInfo;

public class CheckoutSignInPage extends AbstractPageObject {

	private final WebDriver driver;
	private final static String CHECKOUT_AUTH_PAGE = ".container .checkout-auth-option-list";
	private final static String REGISTER_BUTTON_CSS = "div[data-region='checkoutAutRegisterOptionRegion'] button.checkout-auth-option-register-btn";
	private final static String ANONYMOUS_EMAIL_INPUT = "div[data-region='anonymousCheckoutFeedbackRegion'] ~div input[id='Email']";
	private final static String ANONYMOUS_CHECKOUT_BUTTON = "div[data-region='anonymousCheckoutFeedbackRegion'] ~button.checkout-auth-option-anonymous-checkout-btn";
	private final static String EXISTING_USER_EMAIL_INPUT = "input[id='registration_form_emailUsername']";
	private final static String EXISTING_USER_PASSWORD_INPUT = "input[id='registration_form_password']";
	private final static String EXISTING_USER_LOGIN_BUTTON = ".checkout-auth-option-login-btn";

	/**
	 * Constructor.
	 *
	 * @param driver WebDriver which drives this page.
	 */
	public CheckoutSignInPage(final WebDriver driver) {
		super(driver);
		this.driver = driver;
	}

	@Override
	public void verifyCorrectPageIsDisplayed() {
		getWaitDriver().waitForPageToLoad();
		assertThat(getDriver().findElement(By.cssSelector(CHECKOUT_AUTH_PAGE)).isDisplayed())
				.as("Failed to load Checkout Sign In page")
				.isTrue();
	}

	/**
	 * Clicks Register Button.
	 * @return RegisterPage
	 */
	public RegisterPage clickRegisterButton() {
		clickButton(getDriver().findElement(By.cssSelector(REGISTER_BUTTON_CSS)));
		return new RegisterPage(driver);
	}

	/**
	 * Clicks anonymous checkout.
	 * @return CheckoutPage
	 */
	public CheckoutPage anonymousCheckout() {
		CustomerInfo customerInfo = new CustomerInfo();
		clearAndType(getDriver().findElement(By.cssSelector(ANONYMOUS_EMAIL_INPUT)), customerInfo.getUuid() + "test@elasticpath.com");
		clickButton(getDriver().findElement(By.cssSelector(ANONYMOUS_CHECKOUT_BUTTON)));
		return new CheckoutPage(driver);
	}

	/**
	 * Login and Continue as existing shopper.
	 * @param userName username
	 * @param password password
	 * @return CheckoutPage
	 */
	public CheckoutPage registeredShopperCheckout(final String userName, final String password) {
		clearAndType(getDriver().findElement(By.cssSelector(EXISTING_USER_EMAIL_INPUT)), userName);
		clearAndType(getDriver().findElement(By.cssSelector(EXISTING_USER_PASSWORD_INPUT)), password);
		clickButton(getDriver().findElement(By.cssSelector(EXISTING_USER_LOGIN_BUTTON)));
		return new CheckoutPage(driver);
	}

}
