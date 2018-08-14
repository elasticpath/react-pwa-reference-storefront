package com.elasticpath.cucumber.definitions.demo;

import java.util.List;

import cucumber.api.java.en.When;

import com.elasticpath.selenium.SetUp;
import com.elasticpath.selenium.pages.HeaderPage;
import com.elasticpath.selenium.pages.LoginPage;
import com.elasticpath.selenium.pages.NewAddressPage;
import com.elasticpath.selenium.pages.NewPaymentMethodPage;
import com.elasticpath.selenium.pages.ProfilePage;
import com.elasticpath.selenium.pages.RegisterPage;
import com.elasticpath.util.CustomerInfo;

public class RegisterDefinition {

	private RegisterPage registerPage;
	private HeaderPage headerPage;
	private LoginPage loginPage;
	private ProfilePage profilePage;
	private NewAddressPage newAddressPage;
	private NewPaymentMethodPage newPaymentMethodPage;

	public RegisterDefinition() {
		this.headerPage = new HeaderPage(SetUp.getDriver());
	}

	@When("^I register new user with following info$")
	public void registerUser(List<CustomerInfo> customerInfoList) {
		for (CustomerInfo customerInfo : customerInfoList) {
			navigateToRegisterPage();
			registerPage.registerUser(customerInfo);
		}
	}

	@When("^I add default address and payment method$")
	public void addDefaultAddressAndPaymentMethod(List<CustomerInfo> customerInfoList) {
		for (CustomerInfo customerInfo : customerInfoList) {
			navigateToRegisterPage();
			registerPage.registerUser(customerInfo);
		}
	}

	@When("^I register a new user with default address and payment method$")
	public void addAddressAndPaymentMethod() {
		registerUserWithDefaultInfo();
		profilePage = headerPage.clickProfileMenuLink();
		newAddressPage = profilePage.clickProfileNewAddressButton();
		createDefaultAddress();
		newPaymentMethodPage = profilePage.clickProfileNewPaymentMethodButton();
		createDefaultPaymentMethod();
	}

	@When("^I register a new user with default info$")
	public void registerUserWithDefaultInfo() {
		navigateToRegisterPage();
		registerPage.registerUser(new CustomerInfo());
	}

	@When("^I register a new user with default address and payment info$")
	public void registerUserWithDefaultAddressAndPaymentInfo() {
		navigateToRegisterPage();
		registerPage.registerUser(new CustomerInfo());
		addAddressAndPaymentMethod();
	}

	private void navigateToRegisterPage() {
		loginPage = headerPage.clickLoginLink();
		registerPage = loginPage.clickRegisterLink();
	}

	private void createDefaultAddress() {
		newAddressPage.addDefaultProfileAddress_US();
	}

	private void createDefaultPaymentMethod() {
		newPaymentMethodPage.addProfileDefaultPaymentMethod();
	}

}
