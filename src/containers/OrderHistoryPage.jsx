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
import AppHeaderMain from '../components/appheader.main';
import AppFooterMain from '../components/appfooter.main';
import OrderHistoryLineMain from '../components/orderhistoryline.main';

function OrderHistoryPage(props) {
  return (
    <div>
      <AppHeaderMain />
      {/* eslint-disable-next-line react/destructuring-assignment,react/prop-types */}
      <OrderHistoryLineMain orderHistoryLineUrlProps={decodeURIComponent(props.match.params.url)} />
      <AppFooterMain />
    </div>
  );
}

export default OrderHistoryPage;
