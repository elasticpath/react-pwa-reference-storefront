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
import intl from 'react-intl-universal';
import { RouteComponentProps } from 'react-router-dom';
import { PurchaseDetailsMain } from '@elasticpath/store-components';

import './PurchaseReceiptPage.less';

const PurchaseReceiptPage = (props: RouteComponentProps) => {
  const { location, history } = props;

  const handleReorderAllProducts = () => {
    history.push('/mycart');
  };

  const itemDetailLink = '/itemdetail';

  return (
    <div>
      <div className="app-main" style={{ display: 'block' }}>
        <div className="container purchase-receipt-container">
          <h2>
            {intl.get('order-processed-message')}
          </h2>
          <PurchaseDetailsMain data={location.state.data} onReorderAllProducts={handleReorderAllProducts} itemDetailLink={itemDetailLink} />
        </div>
      </div>
    </div>
  );
};

export default PurchaseReceiptPage;
