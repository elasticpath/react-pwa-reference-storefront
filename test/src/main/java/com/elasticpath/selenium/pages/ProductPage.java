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

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class ProductPage extends AbstractPageObject {

	// private final static String SKU_OPTION_SELECT_CSS = "select[id*='product_display_item_sku_select_'][id*='%s']";
	private final static String SKU_OPTION_SELECT_CSS = "div[id='product_display_item_sku_guide'] > div > label[for*='selectorWeight_%s']";
	private final static String SKU_BUTTON_SELECT_CSS = "div[id='product_display_item_size_guide'] > div > label[for*='selectorWeight_%s']";
	private final static String ADD_TO_CART_BUTTON_CSS = "button[id='product_display_item_add_to_cart_button']";
	private final static String ADD_TO_WISHLIST_BUTTON_CSS = "button[id='product_display_item_add_to_wish_list_button']";
	private final static String QUANTITY_SELECT_CSS = "input[class='product-display-item-quantity-select form-control form-control-quantity']";

	private final WebDriver driver;

	/**
	 * Constructor.
	 *
	 * @param driver WebDriver which drives this page.
	 */
	public ProductPage(final WebDriver driver) {
		super(driver);
		this.driver = driver;
	}

	@Override
	public void verifyCorrectPageIsDisplayed() {
		getWaitDriver().waitForPageToLoad();
	}

	public CartPage clickAddToCartButton() {
		getWaitDriver().waitForPageToLoad();
		clickButton(ADD_TO_CART_BUTTON_CSS);
		return new CartPage(driver);
	}

	public WishListPage clickAddToWishListButton() {
		getWaitDriver().waitForPageToLoad();
		clickButton(ADD_TO_WISHLIST_BUTTON_CSS);
		return new WishListPage(driver);
	}

	public void selectQuantity(final String quantity) {
		clearAndType(QUANTITY_SELECT_CSS, quantity);
	}

	public void selectSkuOption(final String skuOption) {
		String beforeUrl = driver.getCurrentUrl();
		clickButton(getDriver().findElement(By.cssSelector(String.format(SKU_OPTION_SELECT_CSS, skuOption))));
		waitForUrlToChange(beforeUrl);
	}

	public void selectSkuButtonOption(final String skuOption) {
		String beforeUrl = driver.getCurrentUrl();
		clickButton(getDriver().findElement(By.cssSelector(String.format(SKU_BUTTON_SELECT_CSS, skuOption))));
		waitForUrlToChange(beforeUrl);
	}

}
