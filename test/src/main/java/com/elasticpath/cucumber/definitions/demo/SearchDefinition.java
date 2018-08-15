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

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;

import com.elasticpath.selenium.SetUp;
import com.elasticpath.selenium.pages.HeaderPage;
import com.elasticpath.selenium.pages.SearchResultsPage;

public class SearchDefinition {

	private SearchResultsPage searchResultsPage;
	private HeaderPage headerPage;

	public SearchDefinition() {
		headerPage = new HeaderPage(SetUp.getDriver());
		searchResultsPage = new SearchResultsPage(SetUp.getDriver());
	}

	@When("^I search for keyword (.+)$")
	public void searchForKeyword(final String keyword) {
		searchResultsPage = headerPage.searchForKeyword(keyword);
	}

	@Then("^I can see my search results for keyword (.+)$")
	public void verifySearchResults(final String keyword) {
		searchResultsPage.verifySearchResultsExist(keyword);
	}

	@Then("^no search results return for keyword (.+)$")
	public void verifyNoSearchResults(final String keyword) {
		searchResultsPage.verifyNoResultsFound(keyword);
	}

}
