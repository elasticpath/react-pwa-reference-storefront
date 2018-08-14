package com.elasticpath.cucumber.definitions.demo;

import cucumber.api.java.en.Given;

import com.elasticpath.selenium.SetUp;
import com.elasticpath.selenium.pages.HeaderPage;

public class HeaderDefinition {
	private HeaderPage headerPage;

	public HeaderDefinition() {
		headerPage = new HeaderPage(SetUp.getDriver());
	}

	@Given("^I select category (.+)$")
	public void selectCategory(final String categoryName) {
		headerPage.selectCategory(categoryName);
	}

	@Given("^I select parent category (.+) and sub category (.+)$")
	public void selectParentAndSubCategory(final String parentCategoryName, final String subCategoryName) {
		headerPage.selectParentCategory(parentCategoryName);
		if (!subCategoryName.equals("-")) {
			headerPage.selectSubCategory(parentCategoryName, subCategoryName);
		}
	}

}
