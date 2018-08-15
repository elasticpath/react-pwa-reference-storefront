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

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class PurchaseReceiptPage extends AbstractPageObject {

	@FindBy(className = "purchase-information-container")
	private WebElement purchaseInformationContainer;

	@FindBy(css = "td[data-el-value='status']")
	private WebElement purchaseStatus;

	@FindBy(css = "td[data-el-value='purchaseNumber']")
	private WebElement purchaseNumber;

	private final WebDriver driver;

	/**
	 * Constructor.
	 *
	 * @param driver WebDriver which drives this page.
	 */
	public PurchaseReceiptPage(final WebDriver driver) {
		super(driver);
		this.driver = driver;
	}

	@Override
	public void verifyCorrectPageIsDisplayed() {
		assertThat(purchaseInformationContainer.isDisplayed())
				.as("Failed to verify Purchase Receipt page")
				.isTrue();
	}

	public void verifyPurchaseStatus(final String purchaseStatus) {
		assertThat(this.purchaseStatus.getText())
				.as("Failed to verify Purchase Receipt page")
				.isEqualTo(purchaseStatus);
	}

	public String getPurchaseNumber() {
		return this.purchaseNumber.getText();
	}

}
