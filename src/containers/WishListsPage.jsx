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
import intl from 'react-intl-universal';
import { login } from '../utils/AuthService';
import WishListMain from '../components/wishlist.main';
import { cortexFetch } from '../utils/Cortex';
import './WishListsPage.less';

const Config = require('Config');

// Array of zoom parameters to pass to Cortex
const zoomArray = [
  'defaultwishlist',
  'defaultwishlist:lineitems',
  'defaultwishlist:lineitems:element',
  'defaultwishlist:lineitems:element:item:price',
  'defaultwishlist:lineitems:element:item:availability',
  'defaultwishlist:lineitems:element:list',
  'defaultwishlist:lineitems:element:list:element',
  'defaultwishlist:lineitems:element:item',
  'defaultwishlist:lineitems:element:item:code',
  'defaultwishlist:lineitems:element:item:definition',
  'defaultwishlist:lineitems:element:item:definition:options:element',
  'defaultwishlist:lineitems:element:item:definition:options:element:value',
  'defaultwishlist:lineitems:element:item:definition:options:element:selector:choice',
  'defaultwishlist:lineitems:element:item:definition:options:element:selector:chosen',
  'defaultwishlist:lineitems:element:item:definition:options:element:selector:choice:description',
  'defaultwishlist:lineitems:element:item:definition:options:element:selector:chosen:description',
  'defaultwishlist:lineitems:element:movetocartform',
];

class WishListsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wishListData: undefined,
      isLoading: false,
    };
  }

  componentDidMount() {
    this.fetchwishListData();
  }

  componentWillReceiveProps() {
    this.fetchwishListData();
  }

  handleQuantityChange() {
    this.setState({ isLoading: true });
    this.fetchwishListData();
  }

  fetchwishListData() {
    login().then(() => {
      cortexFetch(`/?zoom=${zoomArray.sort().join()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(res => res.json())
        .then((res) => {
          this.setState({
            wishListData: res._defaultwishlist[0],
            isLoading: false,
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  render() {
    const { wishListData, isLoading } = this.state;
    return (
      <div className="wish-list-container container">
        <div className="wish-list-container-inner">
          <div data-region="wishListTitleRegion" className="wish-list-title-container" style={{ display: 'block' }}>
            <div>
              {wishListData && !isLoading && (
                <h1 className="view-title">
                  {intl.get('wishlists')}
                </h1>
              )}
              {(!wishListData || isLoading) && (
                <h1 className="view-title">
                  {intl.get('wishlists')}
                </h1>
              )}
            </div>
          </div>
          {wishListData && !isLoading && (
            <div data-region="mainWishListRegion" className="wish-list-main-container" style={{ display: 'block' }}>
              <WishListMain empty={!wishListData._lineitems[0]._element} wishListData={wishListData} handleQuantityChange={() => { this.handleQuantityChange(); }} />
            </div>
          )}
          {(!wishListData || isLoading) && (
            <div data-region="mainWishListRegion" className="wish-list-main-container" style={{ display: 'block' }}>
              <div className="loader" />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default WishListsPage;
