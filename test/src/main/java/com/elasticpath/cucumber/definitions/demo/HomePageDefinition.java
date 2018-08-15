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

package com.elasticpath.cucumber.definitions.demo;

import cucumber.api.java.Before;

import com.elasticpath.selenium.framework.util.SeleniumDriverSetup;
import com.elasticpath.selenium.pages.HomePage;

public class HomePageDefinition {
	private HomePage homePage;

	@Before
	public void init() {
		homePage = new HomePage(SeleniumDriverSetup.getDriver());
		homePage.openHomePage();
	}

}
