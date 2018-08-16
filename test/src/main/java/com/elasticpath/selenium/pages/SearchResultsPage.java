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

public class SearchResultsPage extends AbstractPageObject {

	private final WebDriver driver;
	private final static String RESULTS_LISTING_CSS = "#category_items_listing";
	private final static String NO_RESULTS_CSS = "div[data-region='categoryTitleRegion'] h3";

	/**
	 * Constructor.
	 *
	 * @param driver WebDriver which drives this page.
	 */
	public SearchResultsPage(final WebDriver driver) {
		super(driver);
		this.driver = driver;
	}

	@Override
	public void verifyCorrectPageIsDisplayed() {
	}

	public void verifySearchResultsExist(final String keyword) {
		getWaitDriver().waitForPageToLoad();
		setWebDriverImplicitWait(5);
		assertThat(isElementPresent(By.cssSelector(RESULTS_LISTING_CSS)))
				.as("No search results returned for keyword - " + keyword)
				.isTrue();
		setWebDriverImplicitWaitToDefault();
	}

	public void verifyNoResultsFound(final String keyword) {
		getWaitDriver().waitForPageToLoad();
		setWebDriverImplicitWait(5);
		assertThat(isElementPresent(By.cssSelector(NO_RESULTS_CSS)))
				.as("Unexpected search results returned for keyword - " + keyword)
				.isTrue();
		setWebDriverImplicitWaitToDefault();
	}

}
