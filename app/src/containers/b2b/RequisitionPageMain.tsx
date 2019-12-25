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

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import intl from 'react-intl-universal';

import './RequisitionPageMain.less';

interface RequisitionPageMainProps {
}
interface RequisitionPageMainState {
  isLoading: boolean,
}

class RequisitionPageMain extends Component<RequisitionPageMainProps, RequisitionPageMainState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  render() {
    const { isLoading } = this.state;

    return (
      <div className="requisition-component">
        {isLoading ? (
          <div className="loader" />
        ) : (
          <div>
            <div className="requisition-header">
              <Link className="back-link" to="/b2b">
                <div className="back-arrow" />
                {intl.get('back')}
              </Link>
              <div className="name-container">
                <Link className="back-link-mobile" to="/b2b">
                  <div className="back-arrow" />
                  {intl.get('back')}
                </Link>
                <div className="name">
                  Vancouver
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default RequisitionPageMain;
