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
