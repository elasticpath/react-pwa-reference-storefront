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
import CartPage from '../CartPage';
import CheckoutPage from '../CheckoutPage';
import ProfilePage from '../ProfilePage';
import OrderHistoryPage from '../OrderHistoryPage';
import PurchaseReceiptPage from '../PurchaseReceiptPage';
import RegistrationPage from '../RegistrationPage';
import CheckoutAuthPage from '../CheckoutAuthPage';
import SearchResultsPage from '../SearchResultsPage';
import MaintenancePage from '../MaintenancePage';
import AboutUsPage from '../AboutUsPage';
import ContactUsPage from '../ContactUsPage';
import TermsAndConditionsPage from '../TermsAndConditionsPage';
import OrderReviewPage from '../OrderReviewPage';
import WishListsPage from '../WishListsPage';
import ShippingReturnsPage from '../ShippingReturns';
import ProductsComparePage from '../ProductsComparePage';
import WriteReview from '../WriteReviewPage';
import ChangePasswordForm from '../ChangePasswordPage';
import ResetPasswordForm from '../ResetPasswordPage';
import MyAccountMain from '../MyAccountMain';
import AddPaymentMethod from '../AddPaymentMethod';
import CompanyPage from '../CompanyPage';
import IndustriesPage from '../IndustriesPage';
import ServicesPage from '../ServicesPage';
import SupportPage from '../SupportPage';
import PrivacyPoliciesPage from '../PrivacyPoliciesPage';
import PurchaseHistoryPage from '../b2b/PurchaseHistoryPage';

const router = [{
  path: '/mycart',
  component: CartPage,
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
  path: '/checkout/:cart?',
  component: CheckoutPage,
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
      path: '/account/quotes',
      render: () => 'Quotes',
    },
  ],
}];

export default router;
