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

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.Select;

public class NewAddressPage extends AbstractPageObject {

	@FindBy(className = "address-form-component")
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
		getWaitDriver().waitForPageToLoad();
		enterDefaultAddress("V1V 2R2", "Vancouver", "British Columbia", "Canada");
	}

	public void addDefaultAddress_US() {
		getWaitDriver().waitForPageToLoad();
		enterDefaultAddress("12345", "Seattle", "Washington", "United States");
	}

	public void addDefaultProfileAddress_US() {
		getWaitDriver().waitForPageToLoad();
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
