package com.elasticpath.cucumber.definitions.demo;

import cucumber.api.java.en.Given;

import com.elasticpath.selenium.SetUp;
import com.elasticpath.selenium.pages.CartPage;
import com.elasticpath.selenium.pages.ProductPage;

public class ProductDefinition {

	private ProductPage productPage;
	private CartPage cartPage;

	public ProductDefinition() {
		productPage = new ProductPage(SetUp.getDriver());
	}

	@Given("^product (.+) has unit price of (.+)$")
	public void productWithUnitPrice(final String productName, final String unitPrice) {
//		Empty implementation.
	}

	@Given("^I select quantity (.+) and add product to my cart$")
	public void selectQuantityAndAddToCart(final String quantity) {
		productPage.selectQuantity(quantity);
		cartPage = productPage.clickAddToCartButton();
	}

	@Given("^I select sku option (.+) and choose (.+)")
	public void selectSkuOption(final String skuOption, final String choice) {
		productPage.selectSkuOption(skuOption, choice);
	}

}
