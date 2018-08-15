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

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class HeaderPage extends AbstractPageObject {

	@FindBy(id = "header_navbar_container")
	private WebElement navigationBar;

	private final WebDriver driver;
	private final static String CART_LINK_CSS = "#header_navbar_cart_button";
	private final static String PARENT_CATEGORY_CSS = "li[data-name='%1s']";
	private final static String SUB_CATEGORY_CSS = PARENT_CATEGORY_CSS + " > div[aria-label='navbarDropdown'] > a[title='%2s']";
	private final static String SEARCH_INPUT_CSS = "#header_navbar_search_container_input";
	private final static String SEARCH_BUTTON_CSS = "#header_navbar_search_container_button";
	private final static String LOGIN_BUTTON_CSS = "button[id='header_navbar_login_button']";
	private final static String LOGGEDIN_BUTTON_CSS = "button[id='header_navbar_loggedIn_button']";
	private final static String PROFILE_CSS = "span[id='header_navbar_login_menu_profile_link']";
	private final static String LOGOUT_CSS = "button[id='header_navbar_login_menu_logout_button']";

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
		getDriver().findElement(By.cssSelector(SEARCH_BUTTON_CSS)).click();
		return new SearchResultsPage(driver);
	}

}
