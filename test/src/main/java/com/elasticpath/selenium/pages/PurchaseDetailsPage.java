package com.elasticpath.selenium.pages;

import static org.assertj.core.api.Assertions.assertThat;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class PurchaseDetailsPage extends AbstractPageObject {

	@FindBy(className = "purchase-information-container")
	private WebElement purchaseInformationContainer;

	@FindBy(css = "td[data-el-value='status']")
	private WebElement purchaseStatus;

	private final WebDriver driver;

	/**
	 * Constructor.
	 *
	 * @param driver WebDriver which drives this page.
	 */
	public PurchaseDetailsPage(final WebDriver driver) {
		super(driver);
		this.driver = driver;
	}

	@Override
	public void verifyCorrectPageIsDisplayed() {
		assertThat(purchaseInformationContainer.isDisplayed())
				.as("Failed to verify Purchase Details page")
				.isTrue();
	}

	public void verifyPurchaseStatus(final String purchaseStatus) {
		assertThat(this.purchaseStatus.getText())
				.as("Failed to verify Purchase Details page")
				.isEqualTo(purchaseStatus);
	}

}
