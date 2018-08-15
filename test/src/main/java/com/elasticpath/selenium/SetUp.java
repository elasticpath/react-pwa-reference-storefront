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

package com.elasticpath.selenium;

import java.util.HashMap;
import java.util.Map;

import org.openqa.selenium.UnexpectedAlertBehaviour;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;

import com.elasticpath.selenium.framework.util.PropertyManager;
import com.elasticpath.selenium.framework.util.SeleniumDriverSetup;
import com.elasticpath.selenium.framework.webdriverfactories.ChromeWebDriverFactory;

/**
 * Class to set up extra options and capabliities for Chrome Driver. Other drivers capablities can also be set up here new methods will need to be
 * added.
 */
public final class SetUp {
	/**
	 * browser driver.
	 */
	private static WebDriver driver;

	private static final Object LOCKOBJ = new Object();
	private static final PropertyManager PROPERTY_MANAGER = PropertyManager.getInstance();

	/**
	 * Private constructor.
	 */
	private SetUp() {
	}

	/**
	 * Method for setting up chrome.
	 * Can be used to (add chrome options and chrome capabilities) OR (setting new Chrome Capabilities).
	 */
	public static void setUpChrome() {
		addChromeCapabilities();
	}

	/**
	 * Extends default chrome options in the accelerator project.
	 */
	public static void addChromeOptions() {
		//Uncomment the follow lines of code to add Chrome Options
		ChromeOptions options = ChromeWebDriverFactory.getOptions();
		options.addArguments("--disable-web-security");
	}

	/**
	 * Extends default chrome capabilities in the accelerator project.
	 */
	public static void addChromeCapabilities() {
		DesiredCapabilities capabilities = ChromeWebDriverFactory.getDesiredCapabilities();
		capabilities.setCapability(CapabilityType.UNEXPECTED_ALERT_BEHAVIOUR, UnexpectedAlertBehaviour.IGNORE);
	}

	/**
	 * Ignores default Chrome Capablities and sets new ones from start.
	 */
	public static void setNewChromeCapabilties() {
		//ignores default Capabilites
		ChromeWebDriverFactory.setEnableDefaultCapabilities(false);

		ChromeOptions options = ChromeWebDriverFactory.getOptions();
		options.addArguments("disable-infobars");
		options.addArguments("--start-fullscreen");
		System.setProperty("webdriver.chrome.driver", PROPERTY_MANAGER.getProperty("selenium.chrome.driver.path"));

		Map<String, Object> prefs = new HashMap<String, Object>();
		prefs.put("credentials_enable_service", false);
		prefs.put("profile.password_manager_enabled", false);

		options.setExperimentalOption("prefs", prefs);

		DesiredCapabilities capabilities = ChromeWebDriverFactory.getDesiredCapabilities();
		capabilities.setCapability(ChromeOptions.CAPABILITY, options);
		capabilities.setCapability(CapabilityType.UNEXPECTED_ALERT_BEHAVIOUR, UnexpectedAlertBehaviour.IGNORE);
	}

	/**
	 * Gets the driver.
	 *
	 * @return webdriver.
	 */
	public static WebDriver getDriver() {
		synchronized (LOCKOBJ) {
			if (driver == null) {
				setUpChrome();
				driver = SeleniumDriverSetup.getDriver();
			}
			return driver;
		}
	}

	/**
	 * Quits the driver which will also close browser.
	 */
	public static void quitDriver() {
		synchronized (LOCKOBJ) {
			if (driver != null) {
				SeleniumDriverSetup.quitDriver();
				driver = null;
			}
		}
	}
}
