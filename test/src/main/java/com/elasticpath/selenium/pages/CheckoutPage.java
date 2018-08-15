/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 */

package com.elasticpath.selenium.pages;

import static org.assertj.core.api.Assertions.assertThat;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class CheckoutPage extends AbstractPageObject {

	private final WebDriver driver;
	private final static String CHECKOUTPAGE_CSS = "div[class='checkout-container container']";
	private final static String COMPLETE_ORDER_BUTTON_CSS = "div[data-region='checkoutActionRegion'] button.btn-cmd-submit-order";
	private final static String ADD_NEW_BILLING_ADDRESS_CSS = "div[data-region='billingAddressesRegion'] button.checkout-new-address-btn";
	private final static String ADD_NEW_SHIPPING_ADDRESS_CSS = "div[data-region='shippingAddressesRegion'] button.checkout-new-address-btn";
	private final static String ADD_NEW_PAYMENT_CSS = "div[data-region='paymentMethodsRegion'] button.checkout-new-payment-btn";

	/**
	 * Constructor.
	 *
	 * @param driver WebDriver which drives this page.
	 */
	public CheckoutPage(final WebDriver driver) {
		super(driver);
		this.driver = driver;
	}

	@Override
	public void verifyCorrectPageIsDisplayed() {
		getWaitDriver().waitForPageToLoad();
		assertThat(getDriver().findElement(By.cssSelector(CHECKOUTPAGE_CSS)).isDisplayed())
				.as("Failed to load Checkout page")
				.isTrue();
	}

	public NewAddressPage clickNewAddressButton() {
		clickButton(getDriver().findElement(By.cssSelector(ADD_NEW_BILLING_ADDRESS_CSS)));
		return new NewAddressPage(driver);
	}

	public NewPaymentMethodPage clickNewPaymentMethodButton() {
		clickButton(getDriver().findElement(By.cssSelector(ADD_NEW_PAYMENT_CSS)));
		return new NewPaymentMethodPage(driver);
	}

	public OrderConfirmationPage clickCompleteOrderButton() {
		clickButton(getDriver().findElement(By.cssSelector(COMPLETE_ORDER_BUTTON_CSS)));
		return new OrderConfirmationPage(driver);
	}

}
