/**
 * Copyright © 2019 Elastic Path Software Inc. All rights reserved.
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
import { lazy } from 'react';

export default function b2cRoutes() {
  /** All B2C routes */
  const PurchaseHistoryPage = import(/* webpackChunkName: "PurchaseHistoryPage" */ './containers/b2b/PurchaseHistoryPage');
  const CategoryPage = import(/* webpackChunkName: "CategoryPage" */ './containers/CategoryPage');
  const CheckoutPage = import(/* webpackChunkName: "CheckoutPage" */ './containers/CheckoutPage');
  const ProfilePage = import(/* webpackChunkName: "ProfilePage" */ './containers/ProfilePage');
  const OrderHistoryPage = import(/* webpackChunkName: "OrderHistoryPage" */ './containers/OrderHistoryPage');
  const PurchaseReceiptPage = import(/* webpackChunkName: "PurchaseReceiptPage" */ './containers/PurchaseReceiptPage');
  const RegistrationPage = import(/* webpackChunkName: "RegistrationPage" */ './containers/RegistrationPage');
  const CheckoutAuthPage = import(/* webpackChunkName: "SearchResultsPage" */ './containers/CheckoutAuthPage');
  const SearchResultsPage = import(/* webpackChunkName: "SearchResultsPage" */ './containers/SearchResultsPage');
  const MaintenancePage = import(/* webpackChunkName: "MaintenancePage" */ './containers/MaintenancePage');
  const AboutUsPage = import(/* webpackChunkName: "ContactUsPage" */ './containers/AboutUsPage');
  const ContactUsPage = import(/* webpackChunkName: "ContactUsPage" */ './containers/ContactUsPage');
  const TermsAndConditionsPage = import(/* webpackChunkName: "TermsAndConditionsPage" */ './containers/TermsAndConditionsPage');
  const OrderReviewPage = import(/* webpackChunkName: "OrderReviewPage" */ './containers/OrderReviewPage');
  const WishListsPage = import(/* webpackChunkName: "WishListsPage" */ './containers/WishListsPage');
  const ShippingReturnsPage = import(/* webpackChunkName: "ShippingReturnsPage" */ './containers/ProductsComparePage');
  const ProductsComparePage = import(/* webpackChunkName: "ProductsComparePage" */ './containers/ProductsComparePage');
  const WriteReview = import(/* webpackChunkName: "WriteReview" */ './containers/WriteReviewPage');
  const ChangePasswordForm = import(/* webpackChunkName: "ChangePasswordForm" */ './containers/ChangePasswordPage');
  const ResetPasswordForm = import(/* webpackChunkName: "ResetPasswordForm" */ './containers/ResetPasswordPage');
  const MyAccountMain = import(/* webpackChunkName: "MyAccountMain" */ './containers/MyAccountMain');
  const AddPaymentMethod = import(/* webpackChunkName: "AddPaymentMethod" */ './containers/AddPaymentMethod');
  const CompanyPage = import(/* webpackChunkName: "CompanyPage" */ './containers/CompanyPage');
  const IndustriesPage = import(/* webpackChunkName: "IndustriesPage" */ './containers/IndustriesPage');
  const ServicesPage = import(/* webpackChunkName: "ServicesPage" */ './containers/ServicesPage');
  const SupportPage = import(/* webpackChunkName: "SupportPage" */ './containers/SupportPage');
  const PrivacyPoliciesPage = import(/* webpackChunkName: "PrivacyPoliciesPage" */ './containers/PrivacyPoliciesPage');
  const HomePage = import(/* webpackChunkName: "HomePage" */ './containers/HomePage');
  const CartPage = import(/* webpackChunkName: "CartPage" */ './containers/CartPage');
  const ProductDetailPage = import(/* webpackChunkName: "ProductDetailPage" */ './containers/ProductDetailPage');

  return [{
    path: '/',
    exact: true,
    component: lazy(() => HomePage),
  }, {
    path: '/mycart',
    component: lazy(() => CartPage),
  }, {
    path: '/category',
    exact: true,
    component: lazy(() => CategoryPage),
  }, {
    path: '/category/:id',
    exact: true,
    component: lazy(() => CategoryPage),
  }, {
    path: '/category/:id/*',
    exact: true,
    component: lazy(() => CategoryPage),
  }, {
    path: '/checkout/:cart?',
    component: lazy(() => CheckoutPage),
  }, {
    path: '/itemdetail',
    exact: true,
    component: lazy(() => ProductDetailPage),
  }, {
    path: '/itemdetail/:url',
    component: lazy(() => ProductDetailPage),
  }, {
    path: '/order/:cart?',
    component: lazy(() => OrderReviewPage),
  }, {
    path: '/orderDetails/:url',
    component: lazy(() => OrderHistoryPage),
  }, {
    path: '/purchaseReceipt',
    component: lazy(() => PurchaseReceiptPage),
  }, {
    path: '/registration',
    component: lazy(() => RegistrationPage),
  }, {
    path: '/signIn',
    component: lazy(() => CheckoutAuthPage),
  }, {
    path: '/search',
    exact: true,
    component: lazy(() => SearchResultsPage),
  }, {
    path: '/search/:keywords',
    exact: true,
    component: lazy(() => SearchResultsPage),
  }, {
    path: '/search/:keywords/*',
    exact: true,
    component: lazy(() => SearchResultsPage),
  }, {
    path: '/aboutus',
    component: lazy(() => AboutUsPage),
  }, {
    path: '/maintenance',
    component: lazy(() => MaintenancePage),
  }, {
    path: '/contactus',
    component: lazy(() => ContactUsPage),
  }, {
    path: '/termsandconditions',
    component: lazy(() => TermsAndConditionsPage),
  }, {
    path: '/privacypolicies',
    component: lazy(() => PrivacyPoliciesPage),
  }, {
    path: '/company',
    component: lazy(() => CompanyPage),
  }, {
    path: '/industries',
    component: lazy(() => IndustriesPage),
  }, {
    path: '/services',
    component: lazy(() => ServicesPage),
  }, {
    path: '/support',
    component: lazy(() => SupportPage),
  }, {
    path: '/shippingreturns',
    component: lazy(() => ShippingReturnsPage),
  }, {
    path: '/productscompare/:products',
    component: lazy(() => ProductsComparePage),
  }, {
    path: '/write-a-review',
    component: lazy(() => WriteReview),
  }, {
    path: '/password_change',
    component: lazy(() => ChangePasswordForm),
  }, {
    path: '/password_reset',
    component: lazy(() => ResetPasswordForm),
  }, {
    path: '/newpaymentform/paymentdata',
    component: lazy(() => AddPaymentMethod),
  }, {
    path: '/account',
    component: lazy(() => MyAccountMain),
    routes: [
      {
        path: '/account',
        exact: true,
        component: lazy(() => ProfilePage),
      },
      {
        path: '/account/purchase-history',
        component: lazy(() => PurchaseHistoryPage),
      },
      {
        path: '/account/wishlists',
        component: lazy(() => WishListsPage),
      },
      {
        path: '/account/address-book',
        render: () => 'Address Book',
      },
    ],
  }];
}
