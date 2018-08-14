package com.elasticpath.selenium.pages;

import static org.assertj.core.api.Assertions.assertThat;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class OrderConfirmationPage extends AbstractPageObject {


	@FindBy(className = "order-title-container")
	private WebElement orderConfirmationContainer;

	@FindBy(className = "btn-cmd-submit-order")
	private WebElement completePurchaseButton;

	private final WebDriver driver;

	/**
	 * Constructor.
	 *
	 * @param driver WebDriver which drives this page.
	 */
	public OrderConfirmationPage(final WebDriver driver) {
		super(driver);
		this.driver = driver;
	}

	@Override
	public void verifyCorrectPageIsDisplayed() {
		assertThat(orderConfirmationContainer.isDisplayed())
				.as("Failed to verify Review Order page")
				.isTrue();
	}

	public PurchaseReceiptPage clickCompletePurhaseButton() {
		clickButton(completePurchaseButton);
		return new PurchaseReceiptPage(driver);
	}

}
