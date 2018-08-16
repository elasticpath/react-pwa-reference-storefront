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

package com.elasticpath.cucumber.definitions.demo;

import java.util.Map;

import cucumber.api.java.en.And;
import cucumber.api.java.en.When;

import com.elasticpath.selenium.framework.util.SeleniumDriverSetup;
import com.elasticpath.selenium.pages.HeaderPage;
import com.elasticpath.selenium.pages.LoginPage;

public class LoginDefinition {
	private LoginPage loginPage;
	private HeaderPage headerPage;

	public LoginDefinition() {
		this.headerPage = new HeaderPage(SeleniumDriverSetup.getDriver());
	}

	@And("^I login as default shopper")
	public void loginAsDefaultShopper() {
		loginPage = headerPage.clickLoginLink();
		loginPage.loginAsDefaultCustomer();
	}

	@When("^I login as following registered shopper")
	public void loginAsRegisteredShopper(final Map<String, String> shopperLoginMap) {
		loginPage = headerPage.clickLoginLink();
		loginPage.login(shopperLoginMap.get("username"), shopperLoginMap.get("password"));
	}
}
