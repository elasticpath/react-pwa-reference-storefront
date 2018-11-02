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

package com.elasticpath.selenium.pages;

import static org.assertj.core.api.Assertions.assertThat;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class WishListPage extends AbstractPageObject {

	private final static String REMOVE_BUTTON_CSS = "button.btn-cart-removelineitem";
	private final static String EMPTY_WISHLIST_CONTAINER_CSS = ".wish-list-empty-container";
	private final static String WISHLIST_CONTAINER_CSS = "div[class='wish-list-container container']";
	private final static String MOVE_TO_CART_LINEITEM_BUTTON_CSS = "button[class='ep-btn primary small btn-cart-moveToCart']";
	private final static String REMOVE_LINEITEM_BUTTON_CSS = "button.btn-cart-removelineitem";

	private final WebDriver driver;

	/**
	 * Constructor.
	 *
	 * @param driver WebDriver which drives this page.
	 */
	public WishListPage(final WebDriver driver) {
		super(driver);
		this.driver = driver;
	}

	@Override
	public void verifyCorrectPageIsDisplayed() {
		getWaitDriver().waitForPageToLoad();
		assertThat(isElementPresent(By.cssSelector(WISHLIST_CONTAINER_CSS)))
				.as("Not in Wish List Page")
				.isTrue();
	}

	public void verifyWishListItem(final String productName) {
		assertThat(isElementPresent(By.linkText(productName)))
				.as("Product " + productName + " is not in the wish-list as expected")
				.isTrue();
	}

	public CartPage moveWishListLineItemToCart(final String productName) {
		clickButton(getDriver().findElement(By.cssSelector(MOVE_TO_CART_LINEITEM_BUTTON_CSS)));
		return new CartPage(driver);
	}

	public void removeWishListLineItem(final String productName) {
		clickButton(getDriver().findElement(By.cssSelector(REMOVE_LINEITEM_BUTTON_CSS)));
	}

	public void verifyLineItemNotExist(final String productName) {
		getWaitDriver().waitForPageToLoad();
		setWebDriverImplicitWait(1);
		assertThat(isElementPresent(By.linkText(productName)))
				.as("Product " + productName + " is not removed from the wish-list")
				.isFalse();
		setWebDriverImplicitWaitToDefault();
	}

	public void clearWishList() {
		setWebDriverImplicitWait(3);
		if(isElementPresent(By.cssSelector(EMPTY_WISHLIST_CONTAINER_CSS))) {

			for (WebElement remoteButton : getDriver().findElements(By.cssSelector(REMOVE_BUTTON_CSS))) {
				getDriver().findElement(By.cssSelector(REMOVE_BUTTON_CSS)).click();
				getWaitDriver().waitForPageToLoad();
				assertThat(isElementPresent(By.cssSelector(EMPTY_WISHLIST_CONTAINER_CSS)))
						.as("WishList is not empty")
						.isTrue();
			}
		}
		setWebDriverImplicitWaitToDefault();
	}

}
