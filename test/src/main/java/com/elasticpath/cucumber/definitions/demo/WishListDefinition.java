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

import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;

import com.elasticpath.selenium.SetUp;
import com.elasticpath.selenium.pages.WishListPage;
import com.elasticpath.selenium.pages.CartPage;
import com.elasticpath.selenium.pages.HeaderPage;

public class WishListDefinition {

	private HeaderPage headerPage;
	private WishListPage wishListPage;
	private CartPage cartPage;

	public WishListDefinition() {
		headerPage = new HeaderPage(SetUp.getDriver());
		wishListPage = new WishListPage(SetUp.getDriver());
	}

	@When("^I remove the wishlist item (.+)$")
	public void removeWishListLineItem(final String productName) {
		wishListPage.removeWishListLineItem(productName);
	}

	@When("^I move the wishlist item to cart (.+)$")
	public void moveWishListLineItemToCart(final String productName) {
		cartPage = wishListPage.moveWishListLineItemToCart(productName);
	}

	@Then("^Lineitem (.+) is no longer in the wishlist")
	public void verifyLineItemRemoved(final String productName) {
		wishListPage.verifyLineItemNotExist(productName);
	}

	@When("^I clear my wishlist$")
	public void clearWishList() {
		wishListPage.clearWishList();
	}
}
