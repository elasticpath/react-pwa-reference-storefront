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

const CategoryPage = lazy(() => import(/* webpackChunkName: "CategoryPage" */ './containers/CategoryPage'));
const CheckoutPage = lazy(() => import(/* webpackChunkName: "CheckoutPage" */ './containers/CheckoutPage'));
const ProfilePage = lazy(() => import(/* webpackChunkName: "ProfilePage" */ './containers/ProfilePage'));
const OrderHistoryPage = lazy(() => import(/* webpackChunkName: "OrderHistoryPage" */ './containers/OrderHistoryPage'));
const PurchaseReceiptPage = lazy(() => import(/* webpackChunkName: "PurchaseReceiptPage" */ './containers/PurchaseReceiptPage'));
const RegistrationPage = lazy(() => import(/* webpackChunkName: "RegistrationPage" */ './containers/RegistrationPage'));
const CheckoutAuthPage = lazy(() => import(/* webpackChunkName: "SearchResultsPage" */ './containers/CheckoutAuthPage'));
const SearchResultsPage = lazy(() => import(/* webpackChunkName: "SearchResultsPage" */ './containers/SearchResultsPage'));
const MaintenancePage = lazy(() => import(/* webpackChunkName: "MaintenancePage" */ './containers/MaintenancePage'));
const AboutUsPage = lazy(() => import(/* webpackChunkName: "ContactUsPage" */ './containers/AboutUsPage'));
const ContactUsPage = lazy(() => import(/* webpackChunkName: "ContactUsPage" */ './containers/ContactUsPage'));
const TermsAndConditionsPage = lazy(() => import(/* webpackChunkName: "TermsAndConditionsPage" */ './containers/TermsAndConditionsPage'));
const OrderReviewPage = lazy(() => import(/* webpackChunkName: "OrderReviewPage" */ './containers/OrderReviewPage'));
const WishListsPage = lazy(() => import(/* webpackChunkName: "WishListsPage" */ './containers/WishListsPage'));
const ShippingReturnsPage = lazy(() => import(/* webpackChunkName: "ShippingReturnsPage" */ './containers/ProductsComparePage'));
const ProductsComparePage = lazy(() => import(/* webpackChunkName: "ProductsComparePage" */ './containers/ProductsComparePage'));
const WriteReview = lazy(() => import(/* webpackChunkName: "WriteReview" */ './containers/WriteReviewPage'));
const ChangePasswordForm = lazy(() => import(/* webpackChunkName: "ChangePasswordForm" */ './containers/ChangePasswordPage'));
const ResetPasswordForm = lazy(() => import(/* webpackChunkName: "ResetPasswordForm" */ './containers/ResetPasswordPage'));
const MyAccountMain = lazy(() => import(/* webpackChunkName: "MyAccountMain" */ './containers/MyAccountMain'));
const Accounts = lazy(() => import(/* webpackChunkName: "Accounts" */ './containers/b2b/Accounts'));
const AccountMain = lazy(() => import(/* webpackChunkName: "AccountMain" */ './containers/b2b/AccountMain'));
const RequisitionList = lazy(() => import(/* webpackChunkName: "RequisitionList" */ './containers/b2b/RequisitionList'));
const RequisitionPageMain = lazy(() => import(/* webpackChunkName: "RequisitionPageMain" */ './containers/b2b/RequisitionPageMain'));
const AddPaymentMethod = lazy(() => import(/* webpackChunkName: "AddPaymentMethod" */ './containers/AddPaymentMethod'));
const CompanyPage = lazy(() => import(/* webpackChunkName: "CompanyPage" */ './containers/CompanyPage'));
const IndustriesPage = lazy(() => import(/* webpackChunkName: "IndustriesPage" */ './containers/IndustriesPage'));
const ServicesPage = lazy(() => import(/* webpackChunkName: "ServicesPage" */ './containers/ServicesPage'));
const SupportPage = lazy(() => import(/* webpackChunkName: "SupportPage" */ './containers/SupportPage'));
const PrivacyPoliciesPage = lazy(() => import(/* webpackChunkName: "PrivacyPoliciesPage" */ './containers/PrivacyPoliciesPage'));
const HomePage = lazy(() => import(/* webpackChunkName: "HomePage" */ './containers/HomePage'));
const CartPage = lazy(() => import(/* webpackChunkName: "CartPage" */ './containers/CartPage'));
const ProductDetailPage = lazy(() => import(/* webpackChunkName: "ProductDetailPage" */ './containers/ProductDetailPage'));
const PurchaseHistoryPage = lazy(() => import(/* webpackChunkName: "PurchaseHistoryPage" */ './containers/b2b/PurchaseHistoryPage'));

const router = [{
  path: '/',
  exact: true,
  component: HomePage,
}, {
  path: '/mycart',
  component: CartPage,
}, {
  path: '/category',
  exact: true,
  component: CategoryPage,
}, {
  path: '/category/:id',
  exact: true,
  component: CategoryPage,
}, {
  path: '/category/:id/*',
  exact: true,
  component: CategoryPage,
}, {
  path: '/checkout/:cart?',
  component: CheckoutPage,
}, {
  path: '/itemdetail',
  exact: true,
  component: ProductDetailPage,
}, {
  path: '/itemdetail/:url',
  component: ProductDetailPage,
}, {
  path: '/order/:cart?',
  component: OrderReviewPage,
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
  exact: true,
  component: SearchResultsPage,
}, {
  path: '/search/:keywords',
  exact: true,
  component: SearchResultsPage,
}, {
  path: '/search/:keywords/*',
  exact: true,
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
  path: '/privacypolicies',
  component: PrivacyPoliciesPage,
}, {
  path: '/company',
  component: CompanyPage,
}, {
  path: '/industries',
  component: IndustriesPage,
}, {
  path: '/services',
  component: ServicesPage,
}, {
  path: '/support',
  component: SupportPage,
}, {
  path: '/shippingreturns',
  component: ShippingReturnsPage,
}, {
  path: '/productscompare/:products',
  component: ProductsComparePage,
}, {
  path: '/write-a-review',
  component: WriteReview,
}, {
  path: '/password_change',
  component: ChangePasswordForm,
}, {
  path: '/password_reset',
  component: ResetPasswordForm,
}, {
  path: '/newpaymentform/paymentdata',
  component: AddPaymentMethod,
}, {
  path: '/account/account-item/:uri',
  component: AccountMain,
}, {
  path: '/account/requisition-list-item/:uri',
  exact: true,
  component: RequisitionPageMain,
}, {
  path: '/account',
  component: MyAccountMain,
  routes: [
    {
      path: '/account',
      exact: true,
      component: ProfilePage,
    },
    {
      path: '/account/purchase-history',
      component: PurchaseHistoryPage,
    },
    {
      path: '/account/accounts',
      component: Accounts,
    },
    {
      path: '/account/wishlists',
      component: WishListsPage,
    },
    {
      path: '/account/address-book',
      render: () => 'Address Book',
    },
    {
      path: '/account/orders',
      render: () => 'Orders',
    },
    {
      path: '/account/approvals',
      render: () => 'Approvals',
    },
    {
      path: '/account/invitations',
      render: () => 'Invitations',
    },
    {
      path: '/account/requisition-lists',
      exact: true,
      component: RequisitionList,
    },
    {
      path: '/account/quotes',
      render: () => 'Quotes',
    },
  ],
}];

export default router;
