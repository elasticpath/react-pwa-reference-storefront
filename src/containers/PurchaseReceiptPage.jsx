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

import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import AppHeaderMain from '../components/appheader.main';
import AppFooterMain from '../components/appfooter.main';
import PurchaseDetailsMain from '../components/purchasedetails.main';

const PurchaseReceiptPage = (props) => {
  const { location } = props;
  return (
    <div>
      <AppHeaderMain />
      <div className="app-main" style={{ display: 'block' }}>
        <div className="container">
          <h2>
            Thank you! Your order has been processed.
          </h2>
          <PurchaseDetailsMain data={location.state.data} />
        </div>
      </div>
      <AppFooterMain />
    </div>
  );
};

PurchaseReceiptPage.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
};

export default PurchaseReceiptPage;
