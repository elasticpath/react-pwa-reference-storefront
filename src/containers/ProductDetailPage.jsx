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

import React from 'react';
import AppHeaderMain from '../components/appheader.main';
import AppFooterMain from '../components/appfooter.main';
import ProductDisplayItemMain from '../components/productdisplayitem.main';

function ProductDetailPage(props) {
  return (
    <div>
      <AppHeaderMain />
      {/* eslint-disable-next-line react/destructuring-assignment,react/prop-types */}
      <ProductDisplayItemMain productUrl={decodeURIComponent(props.match.params.url)} />
      <AppFooterMain />
    </div>
  );
}

export default ProductDetailPage;
