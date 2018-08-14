package com.elasticpath.cucumber.definitions.demo;

import cucumber.api.java.Before;

import com.elasticpath.selenium.framework.util.SeleniumDriverSetup;
import com.elasticpath.selenium.pages.HomePage;

public class HomePageDefinition {
	private HomePage homePage;

	@Before
	public void init() {
		homePage = new HomePage(SeleniumDriverSetup.getDriver());
		homePage.openHomePage();
	}

}
