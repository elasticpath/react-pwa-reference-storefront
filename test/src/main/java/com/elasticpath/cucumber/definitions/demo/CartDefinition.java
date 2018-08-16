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

import java.util.List;
import java.util.Set;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;

import com.elasticpath.selenium.SetUp;
import com.elasticpath.selenium.pages.CartPage;
import com.elasticpath.selenium.pages.CheckoutPage;
import com.elasticpath.selenium.pages.HeaderPage;

public class CartDefinition {

	private HeaderPage headerPage;
	private CartPage cartPage;

	public CartDefinition() {
		headerPage = new HeaderPage(SetUp.getDriver());
		cartPage = new CartPage(SetUp.getDriver());
	}

	@When("^I click the checkout button$")
	public CheckoutPage clickCheckoutButton() {
		return cartPage.clickProceedToCheckoutButton();
	}

	@Then("^cart should contain following items?$")
	public void verifyCartItem(List<String> cartItemList) {
		cartPage = headerPage.clickCartLink();
		for (String cartItem : cartItemList) {
			cartPage.verifyCartItem(cartItem);
		}
	}

	@When("^I update cart lineitem quantity to (.+) for product (.+)$")
	public void updateCartLineItemQuantity(final String quantity, final String productName) {
		cartPage.updateCartLineItemQuantity(quantity);
	}

	@Then("^the expected cart lineitem total price is (.+) for product (.+)$")
	public void verifyCartLineItemTotalPrice(final String price, final String productName) {
		cartPage.verifyCartLineItemTotalPrice(price);
	}

	@When("^I remove the cart line item (.+)$")
	public void removeCartLineItem(final String productName) {
		cartPage.removeCartLineItem(productName);
	}

	@Then("^Lineitem (.+) is no longer in the cart")
	public void verifyLineItemRemoved(final String productName) {
		cartPage.verifyLineItemNotExist(productName);
	}

	@When("^I clear my cart$")
	public void clearCart() {
		cartPage.clearCart();
	}
}
