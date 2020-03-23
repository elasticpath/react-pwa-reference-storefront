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
export interface ProductDisplayItemMainProps {
    /** product id */
    productId: string,
    /** image url */
    imageUrl?: string,
    /** data set */
    dataSet?: { cartBtnOverride?: string },
    /** handle add to cart */
    onAddToCart?: (...args: any[]) => any,
    /** handle add to wishlist */
    onAddToWishList?: (...args: any[]) => any,
    /** handle add to requisition list */
    onRequisitionPage?: (...args: any[]) => any,
    /** handle change product feature */
    onChangeProductFeature?: (...args: any[]) => any,
    /** handle reload page */
    onReloadPage?: (...args: any[]) => any,
    /** product link */
    productLink?: string,
    /** is in standalone mode */
    isInStandaloneMode?: boolean,
    /** item detail link */
    itemDetailLink?: string,
    /** featured product attribute */
    featuredProductAttribute?: boolean,
  }

export interface ProductDisplayItemMainState {
    productId: any,
    productData: any,
    requisitionListData: any,
    arFileExists: boolean,
    itemConfiguration: { [key: string]: any },
    detailsProductData: any,
    vrMode: boolean;
    multiImages: any,
    meshVRImageExists: boolean,
    backgroundVRImageExists: boolean,
  }
