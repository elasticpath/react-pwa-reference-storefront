package com.elasticpath.selenium.pages;


import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginPage extends AbstractPageObject {

	private final WebDriver driver;
	private final static String LOGIN_MODEL_CSS = "div[id='login-modal'][style*='block']";
	private final static String LOGIN_BUTTON_CSS = LOGIN_MODEL_CSS + " button[id='login_modal_login_button']";
	private final static String REGISTER_BUTTON_CSS = "#login_modal_register_button";
	private final static String USERNAME_INPUT_CSS = LOGIN_MODEL_CSS + " input[id='login_modal_username_input']";
	private final static String PASSWORD_INPUT_CSS = "#login_modal_password_input";

	/**
	 * Constructor.
	 *
	 * @param driver WebDriver which drives this page.
	 */
	public LoginPage(final WebDriver driver) {
		super(driver);
		this.driver = driver;
	}

	@Override
	public void verifyCorrectPageIsDisplayed() {
		getWaitDriver().waitForPageToLoad();
		getWaitDriver().waitForElementToBeVisible(By.cssSelector(LOGIN_MODEL_CSS));
	}

	public void enterUserName(final String userName) {
		clearAndType(USERNAME_INPUT_CSS, getPropertyManager().getProperty("default.customer.username"));
	}

	public void enterPassword(final String password) {
		clearAndType(PASSWORD_INPUT_CSS,getPropertyManager().getProperty("default.customer.password"));
	}

	public void clickLoginButton() {
		clickButton(LOGIN_BUTTON_CSS);
		getWaitDriver().waitForElementToBeInvisible(By.cssSelector(LOGIN_MODEL_CSS));
	}

	public void loginAsDefaultCustomer() {
		login(getPropertyManager().getProperty("default.customer.username"), getPropertyManager().getProperty("default.customer.password"));
	}

	public void login(final String userName, final String password) {
		enterUserName(userName);
		enterPassword(password);
		clickLoginButton();
	}

	public RegisterPage clickRegisterLink() {
		getDriver().findElement(By.cssSelector(REGISTER_BUTTON_CSS)).click();
		return new RegisterPage(driver);
	}
}
