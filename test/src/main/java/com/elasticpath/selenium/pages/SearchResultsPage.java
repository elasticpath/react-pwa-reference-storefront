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
