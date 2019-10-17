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

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ProductDisplayItemMain } from '@elasticpath/store-components';

interface ProductDetailRouterProps {
  url: string;
}

function ProductDetailPage(props: RouteComponentProps<ProductDetailRouterProps>) {
  const { history, location } = props;

  function handleAddToCart() {
    history.push('/mycart');
  }

  function onReloadPage() {
    history.push(location.pathname);
  }

  function handleAddToWishList() {
    history.push('/wishlists');
  }

  function handleChangeProductFeature(path) {
    history.push(`/itemdetail/${path}`);
  }

  const handleProductLink = window.location.href;
  const windowNavigator: any = window.navigator;
  const isInStandaloneMode = windowNavigator.standalone;

  return (
    <div>
      {/* eslint-disable-next-line react/destructuring-assignment,react/prop-types */}
      <ProductDisplayItemMain productId={decodeURIComponent(props.match.params.url)} onChangeProductFeature={handleChangeProductFeature} onAddToCart={handleAddToCart} onAddToWishList={handleAddToWishList} productLink={handleProductLink} isInStandaloneMode={isInStandaloneMode} itemDetailLink="/itemdetail" onReloadPage={onReloadPage} />
    </div>
  );
}

export default ProductDetailPage;
