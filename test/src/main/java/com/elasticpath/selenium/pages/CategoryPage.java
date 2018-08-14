package com.elasticpath.selenium.pages;

import static org.assertj.core.api.Assertions.assertThat;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class CategoryPage extends AbstractPageObject {

	private final WebDriver driver;

	/**
	 * Constructor.
	 *
	 * @param driver WebDriver which drives this page.
	 */
	public CategoryPage(final WebDriver driver) {
		super(driver);
		this.driver = driver;
	}

	@Override
	public void verifyCorrectPageIsDisplayed() {
	}

	public ProductPage selectProduct(final String productName) {
		assertThat(isElementPresent(By.linkText(productName)))
				.as("Unable to find product: " + productName)
				.isTrue();

		driver.findElement(By.linkText(productName)).click();
		return new ProductPage(driver);
	}

}
