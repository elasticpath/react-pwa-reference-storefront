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
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.Keys;

public class HeaderPage extends AbstractPageObject {

	@FindBy(id = "header_navbar_container")
	private WebElement navigationBar;

	private final WebDriver driver;
	private final static String CART_LINK_CSS = "#header_navbar_cart_button";
	private final static String PARENT_CATEGORY_CSS = "li[data-name='%1s']";
	private final static String SUB_CATEGORY_CSS = PARENT_CATEGORY_CSS + " > div[aria-label='navbarDropdown'] > a[title='%2s']";
	private final static String SEARCH_INPUT_CSS = ".global-nav-container .header_navbar_search_container_input";
	private final static String SEARCH_BUTTON_CSS = "#header_navbar_search_container_button";
	private final static String LOGIN_BUTTON_CSS = "#header_navbar_container_buttons .auth-container .global-nav-login";
	private final static String LOGGEDIN_BUTTON_CSS = "#header_navbar_container_buttons .auth-container .global-nav-login";
	private final static String PROFILE_CSS = "#header_navbar_container_buttons span[id='header_navbar_login_menu_profile_link']";
	private final static String LOGOUT_CSS = "#header_navbar_container_buttons .btn-auth-logout";

	/**
	 * Constructor.
	 *
	 * @param driver WebDriver which drives this page.
	 */
	public HeaderPage(final WebDriver driver) {
		super(driver);
		this.driver = driver;
		getWaitDriver().waitForPageToLoad();
	}

	@Override
	public void verifyCorrectPageIsDisplayed() {
	}

	public CategoryPage selectCategory(final String categoryName) {
		navigationBar.findElement(By.cssSelector(String.format(PARENT_CATEGORY_CSS, categoryName))).click();
		return new CategoryPage(driver);
	}

	public void selectParentCategory(final String parentCategoryName) {
		navigationBar.findElement(By.cssSelector(String.format(PARENT_CATEGORY_CSS, parentCategoryName))).click();
	}

	public CategoryPage selectSubCategory(final String parentCategory, final String subCategoryName) {
		navigationBar.findElement(By.cssSelector(String.format(SUB_CATEGORY_CSS, parentCategory, subCategoryName))).click();
		return new CategoryPage(driver);
	}

	public void clickLoggedInLink() {
		getWaitDriver().waitForElementToBeClickable(By.cssSelector(LOGGEDIN_BUTTON_CSS)).click();
	}

	public ProfilePage clickProfileMenuLink() {
		clickLoggedInLink();
		getDriver().findElement(By.cssSelector(PROFILE_CSS)).click();
		return new ProfilePage(driver);
	}

	public LoginPage clickLoginLink() {
		getWaitDriver().waitForElementToBeClickable(By.cssSelector(LOGIN_BUTTON_CSS)).click();
		return new LoginPage(driver);
	}

	public CartPage clickCartLink() {
		getDriver().findElement(By.cssSelector(CART_LINK_CSS)).click();
		return new CartPage(driver);
	}

	public SearchResultsPage searchForKeyword(final String keyword) {
		clearAndType(SEARCH_INPUT_CSS, keyword);
		getWaitDriver().waitForPageToLoad();
		getDriver().findElement(By.cssSelector(SEARCH_INPUT_CSS)).sendKeys(Keys.RETURN);
		return new SearchResultsPage(driver);
	}

}
