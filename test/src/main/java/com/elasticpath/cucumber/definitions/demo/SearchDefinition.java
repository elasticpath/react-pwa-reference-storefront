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
