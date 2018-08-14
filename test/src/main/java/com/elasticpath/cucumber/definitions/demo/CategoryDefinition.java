package com.elasticpath.cucumber.definitions.demo;

import cucumber.api.java.en.Given;

import com.elasticpath.selenium.SetUp;
import com.elasticpath.selenium.pages.CategoryPage;
import com.elasticpath.selenium.pages.ProductPage;

public class CategoryDefinition {

	private CategoryPage categoryPage;
	private ProductPage productPage;

	public CategoryDefinition() {
		categoryPage = new CategoryPage(SetUp.getDriver());
	}

	@Given("^I select product (.+)$")
	public void selectCategory(final String productName) {
		productPage = categoryPage.selectProduct(productName);
	}

}
