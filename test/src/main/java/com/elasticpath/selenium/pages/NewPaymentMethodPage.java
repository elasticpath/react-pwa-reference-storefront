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

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.Select;

public class NewPaymentMethodPage extends AbstractPageObject {

	@FindBy(className = "payment-method-form-container")
	private WebElement paymentMethodFormContainer;

	@FindBy(id = "CardType")
	private WebElement cardType;

	@FindBy(id = "CardHolderName")
	private WebElement cardHolderName;

	@FindBy(id = "CardNumber")
	private WebElement cardNumber;

	@FindBy(id = "ExpiryMonth")
	private WebElement expiryMonth;

	@FindBy(id = "ExpiryYear")
	private WebElement expiryYear;

	@FindBy(id = "SecurityCode")
	private WebElement securityCode;

	@FindBy(id = "saveToProfile")
	private WebElement saveToProfile;

	@FindBy(className = "payment-save-btn")
	private WebElement continueButton;

	private final WebDriver driver;

	/**
	 * Constructor.
	 *
	 * @param driver WebDriver which drives this page.
	 */
	public NewPaymentMethodPage(final WebDriver driver) {
		super(driver);
		this.driver = driver;
	}

	@Override
	public void verifyCorrectPageIsDisplayed() {
		assertThat(paymentMethodFormContainer.isDisplayed())
				.as("Failed to verify New Payment page")
				.isTrue();
	}

	public void selectCardType(final String cardType) {
		new Select(this.cardType).selectByVisibleText(cardType);
	}

	public void enterCardHolderName(final String cardHolderName) {
		clearAndType(this.cardHolderName, cardHolderName);
	}

	public void enterCardNumber(final String cardNumber) {
		clearAndType(this.cardNumber, cardNumber);
	}

	public void selectExpiryMonth(final String expiryMonth) {
		new Select(this.expiryMonth).selectByVisibleText(expiryMonth);
	}

	public void selectExpiryYear(final String expiryYear) {
		new Select(this.expiryYear).selectByVisibleText(expiryYear);
	}

	public void enterSecurityCode(final String securityCode) {
		clearAndType(this.securityCode, securityCode);
	}

	public CheckoutPage addDefaultPaymentMethod() {
		addDefaultPM();
		continueButton.click();
		return new CheckoutPage(driver);
	}

	public void addProfileDefaultPaymentMethod() {
		addDefaultPM();
		saveToProfile.click();
	}

	private void addDefaultPM() {
		selectCardType("Visa");
		enterCardHolderName("Test User");
		enterCardNumber("411111111111111");
		selectExpiryMonth("10");
		selectExpiryYear("2025");
		enterSecurityCode("111");
		continueButton.click();
	}

}
