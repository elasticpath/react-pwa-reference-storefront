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

import './PrivacyPoliciesPage.less';

function PrivacyPoliciesPage() {
  return (
    <div className="static-container container">
      <h2>
        {intl.get('privacy-policy')}
      </h2>
      <div className="static-container">
        <div className="privacy-title">
          {intl.get('privacy')}
        </div>
        <h4>
          {intl.get('your-general-privacy-information')}
        </h4>
        {intl.get('privacy-information')}
        <h4>
          {intl.get('gdpr')}
        </h4>
        {intl.get('gdpr-information')}
        <h4>
          {intl.get('ccpa')}
        </h4>
        {intl.get('ccpa-information')}

        <h2>
          {intl.get('terms-conditions')}
        </h2>
        <div className="privacy-title">
          {intl.get('privacy')}
        </div>
        <h4>
          {intl.get('your-general-privacy-information')}
        </h4>
        {intl.get('privacy-information')}
      </div>
    </div>
  );
}

export default PrivacyPoliciesPage;
