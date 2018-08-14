package com.elasticpath.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.Select;

public class ProductPage extends AbstractPageObject {

	private final static String SKU_OPTION_SELECT_CSS = "select[id*='product_display_item_sku_select_'][id*='%s']";
	private final static String ADD_TO_CART_BUTTON_CSS = "button[id='product_display_item_add_to_cart_button']";
	private final static String QUANTITY_SELECT_CSS = "select[id='product_display_item_quantity_select']";

	private final WebDriver driver;

	/**
	 * Constructor.
	 *
	 * @param driver WebDriver which drives this page.
	 */
	public ProductPage(final WebDriver driver) {
		super(driver);
		this.driver = driver;
	}

	@Override
	public void verifyCorrectPageIsDisplayed() {
		getWaitDriver().waitForPageToLoad();
	}

	public CartPage clickAddToCartButton() {
		clickButton(ADD_TO_CART_BUTTON_CSS);
		return new CartPage(driver);
	}

	public void selectQuantity(final String quantity) {
		new Select(getDriver().findElement(By.cssSelector(QUANTITY_SELECT_CSS))).selectByVisibleText(quantity);
	}

	public void selectSkuOption(final String skuOption, final String choice) {
		String beforeUrl = driver.getCurrentUrl();
		Select skuOptionSelect = new Select(driver.findElement(By.cssSelector(String.format(SKU_OPTION_SELECT_CSS, skuOption.toUpperCase()))));
		skuOptionSelect.selectByVisibleText(choice);
		waitForUrlToChange(beforeUrl);
	}

}
