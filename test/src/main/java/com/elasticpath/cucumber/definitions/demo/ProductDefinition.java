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
