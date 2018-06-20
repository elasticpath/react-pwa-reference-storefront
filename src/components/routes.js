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
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Switch } from 'react-router-dom'

import HomePage from './pages/HomePage/HomePage.jsx';
import CartPage from './pages/CartPage/CartPage.jsx';
import CategoryPage from './pages/CategoryPage/CategoryPage.jsx';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage.jsx';
import EditAddressPage from './pages/EditAddressPage/EditAddressPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage.jsx';
import NewAddressPage from './pages/NewAddressPage/NewAddressPage.jsx';
import NewPaymentPage from './pages/NewPaymentPage/NewPaymentPage.jsx';
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx';
import PurchaseHistoryPage from './pages/PurchaseHistoryPage/PurchaseHistoryPage.jsx';
import PurchaseReceiptPage from './pages/PurchaseReceiptPage/PurchaseReceiptPage.jsx';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage.jsx';
import CheckoutAuthPage from './pages/CheckoutAuthPage/CheckoutAuthPage.jsx';
import SearchResultsPage from './pages/SearchResultsPage/SearchResultsPage.jsx';

import ProductMain from './ui/product/product.main.jsx';
import Product from './ui/product_test/product.jsx';

const router = [{
    path: '/',
    component: HomePage,
}, {
    path: '/products',
    component: Product,
}, {
    path: '/mycart',
    component: CartPage,
}, {
    path: '/category',
    component: CategoryPage,
},{
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
},{
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
}];

export default router;
