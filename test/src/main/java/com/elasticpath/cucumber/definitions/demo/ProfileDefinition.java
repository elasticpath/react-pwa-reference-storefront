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

import java.util.Map;

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
	public ProfilePage goToProfilePage() {
		profilePage =  headerPage.clickProfileMenuLink();
		return profilePage;
	}

	@When("^I click the edit personal info button")
	public void clickEditPersonalInfoButton() {
		profilePage.editPersonalInfoButton();
	}

	@When("^I update my personal info to the following")
	public void editPersonalInfo(final Map<String, String> shopperPersonalInfo) {
		profilePage.updatePersonalInfo(shopperPersonalInfo.get("firstname"), shopperPersonalInfo.get("lastname"));
	}

	@When("^I click the add address button")
	public void clickAddAddressButton() {
		profilePage.clickProfileNewAddressButton();
	}

	@When("^I click the add payment method button")
	public void clickAddPaymentMethodButton() {
		profilePage.clickProfileNewPaymentMethodButton();
	}

	@Then("^I can update my personal info")
	public void verifyPesonalInfoUpdateRegion() {
		profilePage.verifyPesonalInfoUpdateRegionExist();
	}

	@Then("^I can see my purchase history")
	public void verifyPurchaseHistory() {
		profilePage.verifyPurchaseHistory();
	}

	@Then("^I can see my addresses")
	public void verifyProfileAddressesRegion() {
		profilePage.verifyProfileAddressesRegion();
	}

	@Then("^My personal info should be updated")
	public void verifyPersonalInfoUpdated(final Map<String, String> shopperPersonalInfo) {
		profilePage.verifyPersonalInfoUpdated(shopperPersonalInfo.get("firstname"));
	}

}
