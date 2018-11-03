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

public class ProfilePage extends AbstractPageObject {

	@FindBy(css = "div[data-region='profilePersonalInfoRegion']")
	private WebElement profilePersonalInfoRegion;

	@FindBy(css = "div[data-region='componentAddressFormRegion']")
	private WebElement componentAddressFormRegion;

	@FindBy(css = "div[data-region='profilePersonalInfoRegion'] button.profile-personal-info-edit-btn")
	private WebElement editPersonalInfoButton;

	@FindBy(id = "registration_form_firstName")
	private WebElement firstName;

	@FindBy(id = "profile_personal_info_givenName")
	private WebElement personalInfoFirstName;

	@FindBy(id = "registration_form_lastName")
	private WebElement lastName;

	@FindBy(className = "profile-info-save-btn")
	private WebElement savePersonalInfoButton;

	@FindBy(css = "div[data-region='profilePurchaseHistoryRegion']")
	private WebElement profilePurchaseHistoryRegion;

	@FindBy(css = "td[data-el-value='purchaseNumber']")
	private WebElement purchaseNumber;

	@FindBy(css = "div[data-region='profileAddressesRegion']")
	private WebElement profileAddressesRegion;

	@FindBy(css = "div[data-region='profileAddressesRegion'] button.profile-new-address-btn")
	private WebElement addProfileNewAddress;

	@FindBy(className = "new-payment-btn")
	private WebElement addProfileNewPaymentMethod;

	private final static String PURCHASE_ID_LINK_CSS = "a[id='profile_purchase_number_link_%1s']";

	private final WebDriver driver;

	/**
	 * Constructor.
	 *
	 * @param driver WebDriver which drives this page.
	 */
	public ProfilePage(final WebDriver driver) {
		super(driver);
		this.driver = driver;
	}

	@Override
	public void verifyCorrectPageIsDisplayed() {
		assertThat(profilePersonalInfoRegion.isDisplayed())
				.as("Failed to verify Profile page")
				.isTrue();
	}

	public void editPersonalInfoButton() {
		clickButton(editPersonalInfoButton);
	}

	public void enterFirstName(final String firstName) {
		clearAndType(this.firstName, firstName);
	}

	public void enterLastName(final String lastName) {
		clearAndType(this.lastName, lastName);
	}

	public void savePersonalInfoButton() {
		clickButton(savePersonalInfoButton);
	}

	public void updatePersonalInfo(final String firstName, final String... lastName) {
		getWaitDriver().waitForPageToLoad();
		enterFirstName(firstName);
		if (lastName != null && lastName.length > 0) {
			enterLastName(lastName[0]);
		}
		savePersonalInfoButton();
	}

	public NewAddressPage clickProfileNewAddressButton() {
		getWaitDriver().waitForPageToLoad();
		clickButton(addProfileNewAddress);
		return new NewAddressPage(driver);
	}

	public NewPaymentMethodPage clickProfileNewPaymentMethodButton() {
		getWaitDriver().waitForPageToLoad();
		clickButton(addProfileNewPaymentMethod);
		return new NewPaymentMethodPage(driver);
	}

	public PurchaseDetailsPage selectPurchase(final String orderNumber) {
		getWaitDriver().waitForPageToLoad();
		profilePurchaseHistoryRegion.findElement(By.cssSelector(String.format(PURCHASE_ID_LINK_CSS, orderNumber))).click();
		return new PurchaseDetailsPage(driver);
	}

	public void verifyPurchaseHistory() {
		getWaitDriver().waitForPageToLoad();
		assertThat(profilePurchaseHistoryRegion.isDisplayed())
				.as("Failed to verify Profile page")
				.isTrue();
	}

	public void verifyPesonalInfoUpdateRegionExist() {
		getWaitDriver().waitForPageToLoad();
		assertThat(componentAddressFormRegion.isDisplayed())
				.as("Failed to verify Profile page")
				.isTrue();
	}

	public void verifyProfileAddressesRegion() {
		getWaitDriver().waitForPageToLoad();
		assertThat(profileAddressesRegion.isDisplayed())
				.as("Failed to verify Profile page")
				.isTrue();
	}

	public void verifyPurchaseNumber(final String purchaseNumber) {
		getWaitDriver().waitForPageToLoad();
		assertThat(this.purchaseNumber.getText())
				.as("Failed to verify Profile page")
				.isEqualTo(purchaseNumber);
	}

	public void verifyPersonalInfoUpdated(final String firstname) {
		getWaitDriver().waitForPageToLoad();
		setWebDriverImplicitWait(5);
		assertThat(this.personalInfoFirstName.getText())
				.as("Failed to verify Profile page")
				.isEqualTo(firstname);
		setWebDriverImplicitWaitToDefault();
	}

}
