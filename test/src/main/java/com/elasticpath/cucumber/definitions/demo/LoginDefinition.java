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
