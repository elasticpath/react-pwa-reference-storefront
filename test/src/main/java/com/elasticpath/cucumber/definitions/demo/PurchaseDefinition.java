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
import java.util.Map;

import cucumber.api.java.en.And;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.openqa.selenium.WebDriver;

import com.elasticpath.selenium.SetUp;
import com.elasticpath.selenium.pages.CartPage;
import com.elasticpath.selenium.pages.CategoryPage;
import com.elasticpath.selenium.pages.CheckoutPage;
import com.elasticpath.selenium.pages.CheckoutSignInPage;
import com.elasticpath.selenium.pages.HeaderPage;
import com.elasticpath.selenium.pages.NewAddressPage;
import com.elasticpath.selenium.pages.NewPaymentMethodPage;
import com.elasticpath.selenium.pages.OrderConfirmationPage;
import com.elasticpath.selenium.pages.ProductPage;
import com.elasticpath.selenium.pages.PurchaseReceiptPage;
import com.elasticpath.selenium.pages.PurchaseDetailsPage;
import com.elasticpath.selenium.pages.RegisterPage;
import com.elasticpath.selenium.pages.WishListPage;
import com.elasticpath.selenium.pages.ProfilePage;
import com.elasticpath.util.CustomerInfo;
import com.elasticpath.util.ProductInfo;

public class PurchaseDefinition {

	private HeaderPage headerPage;
	private CategoryPage categoryPage;
	private WebDriver driver;
	private ProductPage productPage;
	private List<ProductInfo> productInfoList;
	private NewAddressPage newAddressPage;
	private NewPaymentMethodPage newPaymentMethodPage;
	private CheckoutPage checkoutPage;
	private CartPage cartPage;
	private WishListPage WishListPage;
	private OrderConfirmationPage orderConfirmationPage;
	private PurchaseReceiptPage purchaseReceiptPage;
	private PurchaseDetailsPage	purchaseDetailsPage;
	private CheckoutSignInPage checkoutSignInPage;
	private RegisterPage registerPage;
	private ProfilePage profilePage;


	public PurchaseDefinition() {
		this.driver = SetUp.getDriver();
		headerPage = new HeaderPage(driver);
	}

	@Given("^I add following items? to my cart$")
	public void addItemsToCart(List<ProductInfo> productInfoList) {
		this.productInfoList = productInfoList;
		for (ProductInfo productInfo : this.productInfoList) {
			if (productInfo.getProductSubCategory() != null && productInfo.getProductSubCategory().length() > 0) {
				headerPage.selectParentCategory(productInfo.getProductCategory());
				categoryPage = headerPage.selectSubCategory(productInfo.getProductCategory(), productInfo.getProductSubCategory());
			} else {
				categoryPage = headerPage.selectCategory(productInfo.getProductCategory());
			}
			productPage = categoryPage.selectProduct(productInfo.getProductName());
			productPage.clickAddToCartButton();
		}
	}

	@When("^I add product (.+) to cart$")
	public void addItemsToCart(final String productName) {
		categoryPage = new CategoryPage(driver);
		productPage = categoryPage.selectProduct(productName);
		productPage.clickAddToCartButton();
	}

	@Given("^I add following items? to my wishlist$")
	public void addItemsToWishList(List<ProductInfo> productInfoList) {
		this.productInfoList = productInfoList;
		for (ProductInfo productInfo : this.productInfoList) {
			if (productInfo.getProductSubCategory() != null && productInfo.getProductSubCategory().length() > 0) {
				headerPage.selectParentCategory(productInfo.getProductCategory());
				categoryPage = headerPage.selectSubCategory(productInfo.getProductCategory(), productInfo.getProductSubCategory());
			} else {
				categoryPage = headerPage.selectCategory(productInfo.getProductCategory());
			}
			productPage = categoryPage.selectProduct(productInfo.getProductName());
			productPage.clickAddToWishListButton();
		}
	}

	@When("^I add product (.+) to wishlist$")
	public void addItemsToWishList(final String productName) {
		categoryPage = new CategoryPage(driver);
		productPage = categoryPage.selectProduct(productName);
		productPage.clickAddToWishListButton();
	}

	@When("^I click the purchase button$")
	public void clickCheckoutButton() {
		checkoutPage = new CheckoutPage(SetUp.getDriver());
		checkoutPage.clickCompleteOrderButton();
	}

	@When("^I complete the purchase$")
	public void completePurchase() {
		navigateToCheckoutPage();
		clickPurchaseAndContinueButton();
	}

	@And("^I complete the purchase as a new registered shopper$")
	public void purchaseWithDefaultInfo() {
		navigateToCheckoutSignInPage();
		registerPage = checkoutSignInPage.clickRegisterButton();
		registerPage.registerUser(new CustomerInfo());
		navigateToCheckoutPage();
		newAddressPage = checkoutPage.clickNewAddressButton();
		newAddressPage.addDefaultAddress_US();
		newPaymentMethodPage = checkoutPage.clickNewPaymentMethodButton();
		newPaymentMethodPage.addDefaultPaymentMethod();
		clickPurchaseAndContinueButton();
	}

	@And("^I complete the purchase as an anonymous shopper")
	public void purchaseAsAnonymousShopper() {
		navigateToCheckoutSignInPage();
		checkoutPage = checkoutSignInPage.anonymousCheckout();
		newAddressPage = checkoutPage.clickNewAddressButton();
		newAddressPage.addDefaultAddress_US();
		newPaymentMethodPage = checkoutPage.clickNewPaymentMethodButton();
		newPaymentMethodPage.addDefaultPaymentMethod();
		clickPurchaseAndContinueButton();
	}

	@And("^I complete the purchase with following registered shopper")
	public void purchaseAsExistingShopper(final Map<String, String> shopperLoginMap) {
		navigateToCheckoutSignInPage();
		checkoutPage = checkoutSignInPage.registeredShopperCheckout(shopperLoginMap.get("username"), shopperLoginMap.get("password"));
		clickPurchaseAndContinueButton();
	}

	@When("^I checkout and complete the purchase$")
	public void submitOrder() {
		navigateToCheckoutPage();
		clickPurchaseAndContinueButton();
	}

	@Then("^the purchase status should be (.+)$")
	public void verifyPurchaseStatus(final String purchaseStatus) {
		purchaseReceiptPage.verifyPurchaseStatus(purchaseStatus);
	}

	@Then("^the purchase status in my purchase history should be (.+)$")
	public void verifyPurchaseHistoryStatus(final String purchaseStatus) {
		purchaseReceiptPage.verifyPurchaseStatus(purchaseStatus);
		String purchaseNumber = purchaseReceiptPage.getPurchaseNumber();
		profilePage = headerPage.clickProfileMenuLink();
		purchaseDetailsPage = profilePage.selectPurchase(purchaseNumber);
		purchaseDetailsPage.verifyPurchaseStatus(purchaseStatus);
	}

	private void navigateToCheckoutPage() {
		cartPage = headerPage.clickCartLink();
		checkoutPage = cartPage.clickProceedToCheckoutButton();
	}

	private void navigateToCheckoutSignInPage() {
		cartPage = headerPage.clickCartLink();
		checkoutSignInPage = cartPage.proceedToCheckoutSignIn();
	}

	private void clickPurchaseAndContinueButton() {
		orderConfirmationPage = checkoutPage.clickCompleteOrderButton();
		purchaseReceiptPage = orderConfirmationPage.clickCompletePurhaseButton();
	}

}
