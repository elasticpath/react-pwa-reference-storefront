package com.elasticpath.selenium.pages;

import static org.assertj.core.api.Assertions.assertThat;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class HomePage extends AbstractPageObject {

	@FindBy(css = "div[data-region='homeMainContentRegion']")
	private WebElement homeMainContentRegion;

	/**
	 * Constructor.
	 *
	 * @param driver WebDriver which drives this page.
	 */
	public HomePage(final WebDriver driver) {
		super(driver);
	}

	@Override
	public void verifyCorrectPageIsDisplayed() {
	}

	public void openHomePage() {
		getDriver().get(getSiteURL());
		assertThat(homeMainContentRegion.isDisplayed())
				.as("Failed to verify Home page")
				.isTrue();
	}

}
