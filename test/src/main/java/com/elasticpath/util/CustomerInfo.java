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

package com.elasticpath.util;

import java.util.UUID;

public class CustomerInfo {

	public String email;
	public String password;

	public String firstName;
	public String lastName;
	public String streetAddress;
	public String extendedAddress;
	public String city;
	public String country;
	public String state;
	public String zip;
	public String phone;
	public String cardType;
	public String cardHolderName;
	public String cardNumber;
	public String expiryMonth;
	public String expiryYear;
	public String securityCode;
	public boolean savePaymentMethod = true;

	private String uuid;

	public String getUuid() {
		if (uuid == null) {
			uuid = UUID.randomUUID().toString().substring(0, 5);
		}
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getEmail() {
		return email == null ? getUuid() + "test@elasticpath.com" : email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password == null ? "password" : password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getFirstName() {
		return firstName == null ? "Test_" + getUuid() : firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName == null ? "User_" + getUuid() : lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getStreetAddress() {
		return streetAddress == null ? getUuid() + " Main Street" : streetAddress;
	}

	public void setStreetAddress(String streetAddress) {
		this.streetAddress = streetAddress;
	}

	public String getExtendedAddress() {
		return extendedAddress;
	}

	public void setExtendedAddress(String extendedAddress) {
		this.extendedAddress = extendedAddress;
	}

	public String getCity() {
		return city == null ? "Seattle" : city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getCountry() {
		return country == null ? "USA" : country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getState() {
		return state == null ? "WA" : state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getZip() {
		return zip == null ? "98104" : zip;
	}

	public void setZip(String zip) {
		this.zip = zip;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getCardType() {
		return cardType == null ? "Visa" : cardType;
	}

	public void setCardType(String cardType) {
		this.cardType = cardType;
	}

	public String getCardHolderName() {
		return cardHolderName == null ? "Test User" : cardHolderName;
	}

	public void setCardHolderName(String cardHolderName) {
		this.cardHolderName = cardHolderName;
	}

	public String getCardNumber() {
		return cardNumber == null ? "4111111111111111" : cardNumber;
	}

	public void setCardNumber(String cardNumber) {
		this.cardNumber = cardNumber;
	}

	public String getExpiryMonth() {
		return expiryMonth == null ? "10" : expiryMonth;
	}

	public void setExpiryMonth(String expiryMonth) {
		this.expiryMonth = expiryMonth;
	}

	public String getExpiryYear() {
		return expiryYear == null ? "2020" : expiryYear;
	}

	public void setExpiryYear(String expiryYear) {
		this.expiryYear = expiryYear;
	}

	public String getSecurityCode() {
		return securityCode == null ? "123" : securityCode;
	}

	public void setSecurityCode(String securityCode) {
		this.securityCode = securityCode;
	}

	public boolean isSavePaymentMethod() {
		return savePaymentMethod;
	}

	public void setSavePaymentMethod(boolean savePaymentMethod) {
		this.savePaymentMethod = savePaymentMethod;
	}
}
