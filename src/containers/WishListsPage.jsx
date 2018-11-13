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
import { fetchWishlistData } from '../utils/AuthService';
import WishListMain from '../components/wishlist.main';
import './WishListsPage.less';

class WishListsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wishListData: undefined,
      isLoading: false,
    };
  }

  componentDidMount() {
    this.refreshWishListData();
  }

  componentWillReceiveProps() {
    this.refreshWishListData();
  }

  handleQuantityChange() {
    this.setState({ isLoading: true });
    this.refreshWishListData();
  }

  refreshWishListData() {
    fetchWishlistData()
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
