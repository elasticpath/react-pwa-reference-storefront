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

package com.elasticpath.cucumber.definitions;

import cucumber.api.Scenario;
import cucumber.api.java.After;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;

import com.elasticpath.selenium.SetUp;
import com.elasticpath.selenium.pages.CartPage;
import com.elasticpath.selenium.pages.HeaderPage;

/**
 * Test Base class contains some methods for Before and After tests to be run for each test.
 */
public class TestBase {
	private static boolean screenShotTaken;

	/**
	 * For After hooks, higher order number run first.
	 * Default order value is 10000
	 */

	/**
	 * Takes screenshot on scenario step failure.
	 *
	 * @param scenario Scenario
	 */
	@After(order = 1)
	public void tearDown(final Scenario scenario) {

		if (scenario.isFailed()) {
			final byte[] screenshot = ((TakesScreenshot) SetUp.getDriver()).getScreenshotAs(OutputType.BYTES);
			scenario.embed(screenshot, "image/png");
			screenShotTaken = true;
		}

		SetUp.quitDriver();
	}

	@After(value = "@clearCart", order = 2)
	public void clearCart() {
		HeaderPage headerPage = new HeaderPage(SetUp.getDriver());
		headerPage.clickCartLink();
		CartPage cartPage = new CartPage(SetUp.getDriver());
		cartPage.clearCart();
	}
}
