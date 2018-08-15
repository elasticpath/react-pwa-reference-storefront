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

public class NewAddressPage extends AbstractPageObject {

	@FindBy(className = "create-address-container")
	private WebElement createAddressContainer;

	@FindBy(id = "registration_form_firstName")
	private WebElement firstName;

	@FindBy(id = "registration_form_lastName")
	private WebElement lastName;

	@FindBy(id = "StreetAddress")
	private WebElement streetAddress;

	@FindBy(id = "ExtendedAddress")
	private WebElement extendedAddress;

	@FindBy(id = "City")
	private WebElement city;

	@FindBy(id = "Country")
	private WebElement country;

	@FindBy(id = "Region")
	private WebElement province;

	@FindBy(id = "PostalCode")
	private WebElement postalCode;

	@FindBy(className = "address-save-btn")
	private WebElement saveButton;

	private final WebDriver driver;

	/**
	 * Constructor.
	 *
	 * @param driver WebDriver which drives this page.
	 */
	public NewAddressPage(final WebDriver driver) {
		super(driver);
		this.driver = driver;
	}

	@Override
	public void verifyCorrectPageIsDisplayed() {
		assertThat(createAddressContainer.isDisplayed())
				.as("Failed to verify New Address page")
				.isTrue();
	}

	public void enterFirstName(final String firstName) {
		clearAndType(this.firstName, firstName);
	}

	public void enterLastName(final String lastName) {
		clearAndType(this.lastName, lastName);
	}

	public void enterStreetAddress(final String streetAddress) {
		clearAndType(this.streetAddress, streetAddress);
	}

	public void enterExtendedAddress(final String extendedAddress) {
		clearAndType(this.extendedAddress, extendedAddress);
	}

	public void enterCity(final String city) {
		clearAndType(this.city, city);
	}

	public void selectCountry(final String country) {
		new Select(this.country).selectByVisibleText(country);
	}

	public void selectProvince(final String province) {
		new Select(this.province).selectByVisibleText(province);
	}

	public void enterPostalCode(final String postalCode) {
		clearAndType(this.postalCode, postalCode);
	}

	public void clickSaveButton() {
		saveButton.click();
	}

	public void addDefaultAddress_CA() {
		enterDefaultAddress("V1V 2R2", "Vancouver", "British Columbia", "Canada");
	}

	public void addDefaultAddress_US() {
		enterDefaultAddress("12345", "Seattle", "Washington", "United States");
	}

	public void addDefaultProfileAddress_US() {
		enterProfileDefaultAddress("12345", "Seattle", "Washington", "United States");
	}

	public CheckoutPage enterDefaultAddress(final String postalCode, final String city, final String province, final String country) {
		addDefaultAddress(postalCode, city, province, country);
		return new CheckoutPage(driver);
	}

	public ProfilePage enterProfileDefaultAddress(final String postalCode, final String city, final String province, final String country) {
		addDefaultAddress(postalCode, city, province, country);
		return new ProfilePage(driver);
	}

	private void addDefaultAddress(final String postalCode, final String city, final String province, final String country) {
		enterFirstName("Test");
		enterLastName("User");
		enterStreetAddress("555 Main Street");
		enterCity(city);
		selectCountry(country);
		selectProvince(province);
		enterPostalCode(postalCode);
		clickSaveButton();
	}

}
