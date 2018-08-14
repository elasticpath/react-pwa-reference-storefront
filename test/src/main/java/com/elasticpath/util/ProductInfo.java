package com.elasticpath.util;

public class ProductInfo {

	private String productName;
	private String productCategory;
	private String productSubCategory;

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public ProductInfo(String productCategory, String productSubCategory, String productName) {
		this.productCategory = productCategory;
		this.productSubCategory = productSubCategory;
		this.productName = productName;
	}

	public ProductInfo() {
	}

	public String getProductCategory() {
		return productCategory;
	}

	public void setProductCategory(String productCategory) {
		this.productCategory = productCategory;
	}

	public String getProductSubCategory() {
		return productSubCategory;
	}

	public void setProductSubCategory(String productSubCategory) {
		this.productSubCategory = productSubCategory;
	}
}
