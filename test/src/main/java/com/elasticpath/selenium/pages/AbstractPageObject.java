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

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.elasticpath.selenium.FluentWaitDriver;
import com.elasticpath.selenium.framework.pages.AbstractPage;
import com.elasticpath.selenium.framework.util.PropertyManager;

public abstract class AbstractPageObject extends AbstractPage {

	private final FluentWaitDriver fluentWaitDriver;
	private final String siteURL;
	private static final Logger LOGGER = Logger.getLogger(AbstractPageObject.class);
	private static final long WEBDRIVER_DEFAULT_TIMEOUT = Long.parseLong(PropertyManager.getInstance().getProperty("selenium.waitdriver.timeout"));

	/**
	 * constructor.
	 *
	 * @param driver WebDriver which drives this webpage.
	 */
	public AbstractPageObject(final WebDriver driver) {
		super(driver);
		fluentWaitDriver = new FluentWaitDriver(driver);
		super.setWaitDriver(fluentWaitDriver);
		siteURL = getPropertyManager().getProperty("selenium.session.baseurl");
		verifyCorrectPageIsDisplayed();
	}

	public abstract void verifyCorrectPageIsDisplayed();

	@Override
	public void afterInit() {
		// Do nothing
	}

	/**
	 * Get site url.
	 *
	 * @return the url.
	 */
	public String getSiteURL() {
		return siteURL;
	}


	@Override
	public FluentWaitDriver getWaitDriver() {
		return fluentWaitDriver;
	}

	/**
	 * Sets implicit wait when element not found.
	 *
	 * @param timeoutInSeconds the timeout in seconds.
	 */
	public void setWebDriverImplicitWait(final long timeoutInSeconds) {
		getDriver().manage().timeouts().implicitlyWait(timeoutInSeconds, TimeUnit.SECONDS);
	}

	/**
	 * Sets the default webdriver timeout back to default per selenium property selenium.waitdriver.timeout.
	 */
	public void setWebDriverImplicitWaitToDefault() {
		getDriver().manage().timeouts().implicitlyWait(WEBDRIVER_DEFAULT_TIMEOUT, TimeUnit.SECONDS);
	}

	@Override
	public void clearAndType(final WebElement element, final String text) {
		List<WebElement> elementList = new ArrayList<>();
		elementList.add(element);
		getWaitDriver().waitForElementsToBeNotStale(elementList);

		element.clear();

		if (text != null && !text.isEmpty()) {
			element.sendKeys(text);
		}
	}

	public void clickButton(final String css) {
		getWaitDriver().waitForElementToBeClickable(getDriver().findElement(By.cssSelector(css))).click();
	}

	public void clickButton(final WebElement element) {
		getWaitDriver().waitForElementToBeClickable(element).click();
	}

	/**
	 * Short cut for both clear the field and type in new text.
	 *
	 * @param cssString the css string
	 * @param text      the text
	 */
	public void clearAndType(final String cssString, final String text) {
		getWaitDriver().waitForElementToBeNotStale(cssString);

		getDriver().findElement(By.cssSelector(cssString)).clear();
		getDriver().findElement(By.cssSelector(cssString)).click();

		if (text != null && !text.isEmpty()) {
			getWaitDriver().waitForElementToBeVisible(By.cssSelector(cssString)).sendKeys(text);
			sleep(500);
		}
	}

	/**
	 * Sleep for a number of milliseconds.
	 *
	 * @param mills number of milliseconds.
	 */
	public void sleep(final long mills) {
		try {
			Thread.sleep(mills);
		} catch (InterruptedException e) {
			LOGGER.error(e);
			Thread.currentThread().interrupt();
		}
	}

	public void waitForUrlToChange(final String beforeUrl) {
		int count = 0;
		while (beforeUrl.equals(getDriver().getCurrentUrl()) && count < 10) {
			System.out.println("current url is not equal");
			sleep(500);
		}
	}

	/**
	 * Verifies if element is in viewport.
	 *
	 * @param cssString the css string
	 * @return true if element is in viewport, false if it is not
	 */
	public boolean isElementInViewport(final String cssString) {
		WebElement element = getWaitDriver().waitForElementToBePresent(By.cssSelector(cssString));
		return (Boolean) ((JavascriptExecutor) getDriver()).executeScript(
				"var elem = arguments[0],                      "
						+ "  box = elem.getBoundingClientRect(),    "
						+ "  cx = box.left + box.width / 2,         "
						+ "  cy = box.top + box.height / 2,         "
						+ "  e = document.elementFromPoint(cx, cy); "
						+ "for (; e; e = e.parentElement) {         "
						+ "  if (e === elem)                        "
						+ "    return true;                         "
						+ "}                                        "
						+ "return false;", element);
	}

	/**
	 * Scrolls element into view.
	 *
	 * @param element The WebElement.
	 */
	protected void scrollElementIntoView(final WebElement element) {
		JavascriptExecutor jse = (JavascriptExecutor) getDriver();
		jse.executeScript("arguments[0].scrollIntoView();", element);
	}

	/**
	 * Waits for element to load.
	 *
	 * @param element the element
	 */
	public void waitForElementToLoad(final WebElement element) {
		int counter = 0;
		int initialX = 0;
		int initialY = 0;
		int finalX = 1;
		int finalY = 1;

		while (initialX != finalX && initialY != finalY && counter < 5) {
			initialX = element.getLocation().getX();
			initialY = element.getLocation().getY();

			sleep(1000);

			finalX = element.getLocation().getX();
			finalY = element.getLocation().getY();

//			LOGGER.debug(element.getAttribute("id") + " element x and y locations before sleep - x: " + initialX + " y: " + initialY);
//			LOGGER.debug(element.getAttribute("id") + " element x and y locations after sleep - x: " + finalX + " y: " + finalY);

			counter++;
		}
	}
}
