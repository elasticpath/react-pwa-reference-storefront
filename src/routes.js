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

import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Switch } from 'react-router-dom';

import HomePage from './containers/HomePage.jsx';
import CartPage from './containers/CartPage.jsx';
import CategoryPage from './containers/CategoryPage.jsx';
import CheckoutPage from './containers/CheckoutPage.jsx';
import EditAddressPage from './containers/EditAddressPage.jsx';
import ProductDetailPage from './containers/ProductDetailPage.jsx';
import NewAddressPage from './containers/NewAddressPage.jsx';
import NewPaymentPage from './containers/NewPaymentPage.jsx';
import ProfilePage from './containers/ProfilePage.jsx';
import PurchaseHistoryPage from './containers/PurchaseHistoryPage.jsx';
import PurchaseReceiptPage from './containers/PurchaseReceiptPage.jsx';
import RegistrationPage from './containers/RegistrationPage.jsx';
import CheckoutAuthPage from './containers/CheckoutAuthPage.jsx';
import SearchResultsPage from './containers/SearchResultsPage.jsx';
import AboutUsPage from './containers/AboutUsPage.jsx';
import ContactUsPage from './containers/ContactUsPage.jsx';
import TermsAndConditionsPage from './containers/TermsAndConditionsPage.jsx';

const router = [{
  path: '/',
  component: HomePage,
}, {
  path: '/mycart',
  component: CartPage,
}, {
  path: '/category',
  component: CategoryPage,
}, {
  path: '/category/:url',
  component: CategoryPage,
}, {
  path: '/checkout',
  component: CheckoutPage,
}, {
  path: '/editaddress',
  component: EditAddressPage,
}, {
  path: '/itemdetail',
  component: ProductDetailPage,
}, {
  path: '/itemdetail/:url',
  component: ProductDetailPage,
}, {
  path: '/newaddressform',
  component: NewAddressPage,
}, {
  path: '/newpaymentform',
  component: NewPaymentPage,
}, {
  path: '/profile',
  component: ProfilePage,
}, {
  path: '/purchaseDetails',
  component: PurchaseHistoryPage,
}, {
  path: '/purchaseReceipt',
  component: PurchaseReceiptPage,
}, {
  path: '/registration',
  component: RegistrationPage,
}, {
  path: '/signIn',
  component: CheckoutAuthPage,
}, {
  path: '/search',
  component: SearchResultsPage,
}, {
  path: '/search/:keywords',
  component: SearchResultsPage,
}, {
  path: '/aboutus',
  component: AboutUsPage,
}, {
  path: '/contactus',
  component: ContactUsPage,
}, {
  path: '/termsandconditions',
  component: TermsAndConditionsPage,
}];

export default router;
