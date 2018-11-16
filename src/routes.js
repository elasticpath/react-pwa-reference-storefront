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

import HomePage from './containers/HomePage';
import CartPage from './containers/CartPage';
import CategoryPage from './containers/CategoryPage';
import CheckoutPage from './containers/CheckoutPage';
import EditAddressPage from './containers/EditAddressPage';
import ProductDetailPage from './containers/ProductDetailPage';
import NewAddressPage from './containers/NewAddressPage';
import NewPaymentPage from './containers/NewPaymentPage';
import ProfilePage from './containers/ProfilePage';
import OrderHistoryPage from './containers/OrderHistoryPage';
import PurchaseReceiptPage from './containers/PurchaseReceiptPage';
import RegistrationPage from './containers/RegistrationPage';
import CheckoutAuthPage from './containers/CheckoutAuthPage';
import SearchResultsPage from './containers/SearchResultsPage';
import MaintenancePage from './containers/MaintenancePage';
import AboutUsPage from './containers/AboutUsPage';
import ContactUsPage from './containers/ContactUsPage';
import TermsAndConditionsPage from './containers/TermsAndConditionsPage';
import OrderReviewPage from './containers/OrderReviewPage';
import WishListsPage from './containers/WishListsPage';

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
  path: '/order',
  component: OrderReviewPage,
}, {
  path: '/profile',
  component: ProfilePage,
}, {
  path: '/orderDetails/:url',
  component: OrderHistoryPage,
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
  path: '/search/:keywords/:pagination',
  component: SearchResultsPage,
}, {
  path: '/aboutus',
  component: AboutUsPage,
}, {
  path: '/maintenance',
  component: MaintenancePage,
}, {
  path: '/contactus',
  component: ContactUsPage,
}, {
  path: '/termsandconditions',
  component: TermsAndConditionsPage,
}, {
  path: '/wishlists',
  component: WishListsPage,
}];

export default router;
