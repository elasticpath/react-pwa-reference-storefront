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
import intl from 'react-intl-universal';
import './countinfopopup.less';
import { Link } from 'react-router-dom';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

let Config: IEpConfig | any = {};

interface CountInfoPopUpProps {
  /** count data */
  countData: {
    count: number,
    name: string,
    link: string,
    entity: string,
  },
}

interface CountInfoPopUpState {
  cartData: any,
}

class CountInfoPopUp extends Component<CountInfoPopUpProps, CountInfoPopUpState> {
  static defaultProps = {};

  constructor(props) {
    super(props);

    const epConfig = getConfig();
    Config = epConfig.config;
  }

  componentDidMount() {}

  render() {
    const { countData } = this.props;
    const {
      count, name, link, entity,
    } = countData;

    const message = (
      <div className="multi-cart-message">
        <b>{count}</b>
        {' '}
        {intl.get('item-was-added-to-your')}
        {' '}
        <b>{name}</b>
        {' '}
        {entity}
      </div>
    );
    return (
      <div className="cart-nav-container">
        <div className="multi-cart-menu">
          {message}
        </div>
        <div className="checkout-btn-container">

          <Link className="ep-btn primary checkout-btn link-to-cart" to={link}>
            {`${intl.get('view-your')} ${entity}`}
          </Link>

        </div>
      </div>
    );
  }
}

export default CountInfoPopUp;
