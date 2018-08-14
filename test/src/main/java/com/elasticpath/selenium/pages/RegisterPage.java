package com.elasticpath.selenium.pages;

import static org.assertj.core.api.Assertions.assertThat;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import com.elasticpath.util.CustomerInfo;

public class RegisterPage extends AbstractPageObject {

	@FindBy(className = "registration-container")
	private WebElement registrationContainer;

	@FindBy(id = "registration_form_firstName")
	private WebElement firstName;

	@FindBy(id = "registration_form_lastName")
	private WebElement lastName;

	@FindBy(id = "registration_form_emailUsername")
	private WebElement emailUserName;

	@FindBy(id = "registration_form_password")
	private WebElement password;

	@FindBy(id = "registration_form_passwordConfirm")
	private WebElement confirmPassword;

	@FindBy(id = "registration_form_register_button")
	private WebElement submitButton;


	private final WebDriver driver;

	/**
	 * Constructor.
	 *
	 * @param driver WebDriver which drives this page.
	 */
	public RegisterPage(final WebDriver driver) {
		super(driver);
		this.driver = driver;
	}

	@Override
	public void verifyCorrectPageIsDisplayed() {
		assertThat(registrationContainer.isDisplayed())
				.as("Failed to verify Register page")
				.isTrue();
	}

	public HomePage registerUser(final CustomerInfo customerInfo) {
		clearAndType(firstName, customerInfo.getFirstName());
		clearAndType(lastName, customerInfo.getLastName());
		clearAndType(emailUserName, customerInfo.getEmail());
		System.out.println("emailUserName..... " + customerInfo.getEmail());
		clearAndType(password, customerInfo.getPassword());
		clearAndType(confirmPassword, customerInfo.getPassword());
		submitButton.click();
		assertThat(getDriver().findElement(By.cssSelector("div[data-region='homeMainContentRegion']")).isDisplayed())
				.as("Failed to verify Home page")
				.isTrue();

		return new HomePage(driver);
	}

}
