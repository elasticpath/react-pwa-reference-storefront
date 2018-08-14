package com.elasticpath.cucumber.definitions.demo;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;

import com.elasticpath.selenium.SetUp;
import com.elasticpath.selenium.pages.HeaderPage;
import com.elasticpath.selenium.pages.PurchaseDetailsPage;
import com.elasticpath.selenium.pages.ProfilePage;

public class ProfileDefinition {

	private ProfilePage profilePage;
	private PurchaseDetailsPage purchaseDetailsPage;
	private HeaderPage headerPage;

	public ProfileDefinition() {
		headerPage = new HeaderPage(SetUp.getDriver());
	}

	@When("^I navigate to the profile page")
	public void goToProfilePage() {
		headerPage.clickProfileMenuLink();
	}

	@Then("^I can see my purchase history")
	public void verifyPurchaseHistory() {
		profilePage.verifyPurchaseHistoryExist();
	}

}
