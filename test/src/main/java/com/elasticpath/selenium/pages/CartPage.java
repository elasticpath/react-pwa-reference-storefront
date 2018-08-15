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

package com.elasticpath.selenium.pages;

import static org.assertj.core.api.Assertions.assertThat;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

public class CartPage extends AbstractPageObject {

	private final static String REMOVE_BUTTON_CSS = "button.btn-cart-removelineitem";
	private final static String EMPTY_CART_CONTAINER_CSS = ".cart-empty-container";
	private final static String CART_CONTAINER_CSS = "div[class='cart-container container']";
	private final static String CHECKOUT_BUTTON_CSS = "button[class='btn-cmd-checkout']";
	private final static String QUANTITY_SELECT_CSS = "select[id='cart-lineItem-select-quantity']";
	private final static String CART_LINE_ITEM_PRICE_CSS = "div[data-region='itemTotalPriceRegion'] .cart-total-purchase-price";
	private final static String REMOVE_LINEITEM_BUTTON_CSS = "button.btn-cart-removelineitem";

	private final WebDriver driver;

	/**
	 * Constructor.
	 *
	 * @param driver WebDriver which drives this page.
	 */
	public CartPage(final WebDriver driver) {
		super(driver);
		this.driver = driver;
	}

	@Override
	public void verifyCorrectPageIsDisplayed() {
		getWaitDriver().waitForPageToLoad();
		assertThat(isElementPresent(By.cssSelector(CART_CONTAINER_CSS)))
				.as("Not in Cart Page")
				.isTrue();
	}

	public CheckoutPage clickProceedToCheckoutButton() {
		clickButton(getDriver().findElement(By.cssSelector(CHECKOUT_BUTTON_CSS)));
		return new CheckoutPage(driver);
	}

	public CheckoutSignInPage proceedToCheckoutSignIn() {
		clickButton(getDriver().findElement(By.cssSelector(CHECKOUT_BUTTON_CSS)));
		return new CheckoutSignInPage(driver);
	}

	public void verifyCartItem(final String productName) {
		assertThat(isElementPresent(By.linkText(productName)))
				.as("Product " + productName + " is not in the cart as expected")
				.isTrue();
	}

	public void updateCartLineItemQuantity(final String quantity) {
		new Select(getDriver().findElement(By.cssSelector(QUANTITY_SELECT_CSS))).selectByVisibleText(quantity);
	}

//	TODO verify price based on given lineitem name.
	public void verifyCartLineItemTotalPrice(final String cartLineItemTotalPrice) {
		getWaitDriver().waitForPageToLoad();
		assertThat(cartLineItemTotalPrice)
				.as("Expected cart line item total price not match.")
				.isEqualTo(getDriver().findElement(By.cssSelector(CART_LINE_ITEM_PRICE_CSS)).getText());
	}

	public void removeCartLineItem(final String productName) {
		clickButton(getDriver().findElement(By.cssSelector(REMOVE_LINEITEM_BUTTON_CSS)));
	}

	public void verifyLineItemNotExist(final String productName) {
		getWaitDriver().waitForPageToLoad();
		setWebDriverImplicitWait(1);
		assertThat(isElementPresent(By.linkText(productName)))
				.as("Product " + productName + " is not removed from the cart")
				.isFalse();
		setWebDriverImplicitWaitToDefault();
	}

	public void clearCart() {
		setWebDriverImplicitWait(3);
		if(isElementPresent(By.cssSelector(EMPTY_CART_CONTAINER_CSS))) {

			for (WebElement remoteButton : getDriver().findElements(By.cssSelector(REMOVE_BUTTON_CSS))) {
				getDriver().findElement(By.cssSelector(REMOVE_BUTTON_CSS)).click();
				getWaitDriver().waitForPageToLoad();
				assertThat(isElementPresent(By.cssSelector(EMPTY_CART_CONTAINER_CSS)))
						.as("Cart is not empty")
						.isTrue();
			}
		}
		setWebDriverImplicitWaitToDefault();
	}

}
