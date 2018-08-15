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
