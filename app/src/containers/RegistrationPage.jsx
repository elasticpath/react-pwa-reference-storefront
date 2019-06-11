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
import { RegistrationFormMain } from '@elasticpath/store-components';

function RegistrationPage(props) {
  RegistrationPage.propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
  };

  function handleRegisterSuccess() {
    const { location, history } = props;
    if (location.state && location.returnPage) {
      history.push(location.state.returnPage);
    } else {
      history.push('/');
    }
    window.location.reload();
  }

  return (
    <div>
      <RegistrationFormMain onRegisterSuccess={handleRegisterSuccess} />
    </div>
  );
}

export default RegistrationPage;
