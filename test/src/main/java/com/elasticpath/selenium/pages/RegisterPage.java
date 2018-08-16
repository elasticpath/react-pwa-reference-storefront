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

public class RegisterPage extends AbstractPageObject {

	@FindBy(className = "registration-container")
	private WebElement registrationContainer;

	@FindBy(id = "registration_form_firstName")
	private WebElement firstName;

	@FindBy(id = "registration_form_lastName")
	private WebElement lastName;

	@FindBy(id = "registration_form_emailUsername")
	private WebElement emailUserName;

	@FindBy(id = "registration_form_password")
	private WebElement password;

	@FindBy(id = "registration_form_passwordConfirm")
	private WebElement confirmPassword;

	@FindBy(id = "registration_form_register_button")
	private WebElement submitButton;


	private final WebDriver driver;

	/**
	 * Constructor.
	 *
	 * @param driver WebDriver which drives this page.
	 */
	public RegisterPage(final WebDriver driver) {
		super(driver);
		this.driver = driver;
	}

	@Override
	public void verifyCorrectPageIsDisplayed() {
		assertThat(registrationContainer.isDisplayed())
				.as("Failed to verify Register page")
				.isTrue();
	}

	public HomePage registerUser(final CustomerInfo customerInfo) {
		clearAndType(firstName, customerInfo.getFirstName());
		clearAndType(lastName, customerInfo.getLastName());
		clearAndType(emailUserName, customerInfo.getEmail());
		System.out.println("emailUserName..... " + customerInfo.getEmail());
		clearAndType(password, customerInfo.getPassword());
		clearAndType(confirmPassword, customerInfo.getPassword());
		submitButton.click();
		assertThat(getDriver().findElement(By.cssSelector("div[data-region='homeMainContentRegion']")).isDisplayed())
				.as("Failed to verify Home page")
				.isTrue();

		return new HomePage(driver);
	}

}
