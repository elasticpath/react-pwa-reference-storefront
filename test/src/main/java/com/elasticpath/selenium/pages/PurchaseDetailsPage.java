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
		getWaitDriver().waitForPageToLoad();
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
