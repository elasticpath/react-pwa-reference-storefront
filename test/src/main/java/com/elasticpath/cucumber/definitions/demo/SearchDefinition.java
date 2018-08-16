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
