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
import ReactRouterPropTypes from 'react-router-prop-types';
import { PaymentFormMain } from '@elasticpath/react-storefront-components';

function NewPaymentPage(props) {
  NewPaymentPage.propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
  };

  const { history, location } = props;

  function redirectToProfilePage() {
    history.push('/profile');
  }

  function redirectToMainPage() {
    history.push('/');
  }

  function redirectToReturnedPage() {
    history.push(location.state.returnPage);
  }

  let addressData;
  if (location.state) {
    addressData = location.state;
  }

  return (
    <div>
      <PaymentFormMain {...props} onMainPage={redirectToMainPage} onProfilePage={redirectToProfilePage} onReturnedPage={redirectToReturnedPage} addressData={addressData} />
    </div>
  );
}

export default NewPaymentPage;
