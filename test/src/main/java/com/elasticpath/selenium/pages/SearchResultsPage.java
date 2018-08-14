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
