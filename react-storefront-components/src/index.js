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
import { init } from './utils/ConfigProvider';
import ProductDisplayItemMain from './components/productdisplayitem.main';
import ProductListMain from './components/productlist.main';
import ProductListItemMain from './components/productlistitem.main';
import ProductRecommendationsDisplayMain from './components/productrecommendations.main';
import BundleConstituentsDisplayMain from './components/bundleconstituents.main';
import CategoryItemsMain from './components/categoryitems.main';
import FeaturedProducts from './components/featuredproducts.main';
import ProductListPagination from './components/productlistpagination.main';
import SortProductMenu from './components/sortproductmenu.main';
import CartLineItem from './components/cart.lineitem';
import CartMain from './components/cart.main';
import CheckoutSummaryList from './components/checkout.summarylist';
import ProductListLoadMore from './components/productlistloadmore';
import IndiRecommendationsDisplayMain from './components/indirecommendations.main';
import SearchFacetNavigationMain from './components/searchfacetnavigation.main';
import ProfileAddressesMain from './components/profileaddresses.main';
import ProfileemailinfoMain from './components/profileemailinfo.main';
import ProfileInfoMain from './components/profileInfo.main';
import ProfilePaymentMethodsMain from './components/profilepaymentmethods.main';
import OrderHistoryMain from './components/orderhistory.main';
import GdprSupportModal from './components/gdprsupport.main';
import GiftcertificateFormMain from './components/giftcertificateform.main';
import WishListMain from './components/wishlist.main';
import Carousel from './components/carousel.homepage';

export default { init };

export {
  init,
  BundleConstituentsDisplayMain,
  CartLineItem,
  CartMain,
  CheckoutSummaryList,
  ProductDisplayItemMain,
  ProductListMain,
  ProductListItemMain,
  ProductListLoadMore,
  ProductListPagination,
  FeaturedProducts,
  IndiRecommendationsDisplayMain,
  SearchFacetNavigationMain,
  ProductRecommendationsDisplayMain,
  SortProductMenu,
  CategoryItemsMain,
  ProfileAddressesMain,
  ProfileemailinfoMain,
  ProfileInfoMain,
  ProfilePaymentMethodsMain,
  OrderHistoryMain,
  GdprSupportModal,
  GiftcertificateFormMain,
  WishListMain,
  Carousel,
};
