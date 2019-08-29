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
import * as cortex from '@elasticpath/cortex-client';
import { RouteComponentProps } from 'react-router-dom';
import { ClientContext, WishListMain } from '@elasticpath/store-components';
import Config from '../ep.config.json';

import './WishListsPage.less';

const zoomArray: cortex.RootFetch = {
  defaultwishlist: {
    lineitems: {
      element: {
        item: {
          price: {},
          availability: {},
          code: {},
          definition: {
            options: {
              element: {
                value: {},
                selector: {
                  choice: {},
                  chosen: {},
                },
              },
            },
          },
        },
        list: {
          element: {},
        },
        movetocartform: {},
      },
    },
  },
};

interface WishListsPageState {
    wishListData: cortex.Wishlist,
    isLoading: boolean,
    invalidPermission: boolean,
}
class WishListsPage extends React.Component<RouteComponentProps, WishListsPageState> {
  static contextType = ClientContext;

  client: cortex.IClient;

  constructor(props) {
    super(props);
    this.state = {
      wishListData: undefined,
      isLoading: false,
      invalidPermission: false,
    };


    this.handleItemConfiguratorAddToCart = this.handleItemConfiguratorAddToCart.bind(this);
    this.handleItemMoveToCart = this.handleItemMoveToCart.bind(this);
    this.handleItemRemove = this.handleItemRemove.bind(this);
  }

  componentDidMount() {
    this.client = this.context;
    this.fetchwishListData();
  }

  componentWillReceiveProps() {
    this.fetchwishListData();
  }

  handleQuantityChange() {
    this.setState({ isLoading: true });
    this.fetchwishListData();
  }

  async fetchwishListData() {
    try {
      const wishListRes = await this.client.root().fetch(zoomArray);

      if (!wishListRes.defaultwishlist) {
        this.setState({
          invalidPermission: true,
        });
      } else {
        this.setState({
          wishListData: wishListRes.defaultwishlist,
          isLoading: false,
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  checkPermissions() {
    const { invalidPermission, wishListData, isLoading } = this.state;
    if (Config.b2b.enable && invalidPermission) {
      return (
        <div className="message-permission">
          <h2>{intl.get('permission-message')}</h2>
        </div>
      );
    }
    return (
      (!wishListData || isLoading) && (
        <div data-region="mainWishListRegion" className="wish-list-main-container" style={{ display: 'block' }}>
          <div className="loader" />
        </div>
      )
    );
  }

  handleItemConfiguratorAddToCart() {
    const { history } = this.props;
    history.push('/mybag');
  }

  handleItemMoveToCart() {
    const { history } = this.props;
    history.push('/mybag');
  }

  handleItemRemove() {
    const { history, location } = this.props;
    history.push(location.pathname);
  }

  render() {
    const { wishListData, isLoading } = this.state;
    const itemDetailLink = '/itemdetail';
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
              <WishListMain
                empty={!wishListData.lineitems.elements}
                wishListData={wishListData}
                handleQuantityChange={() => { this.handleQuantityChange(); }}
                onItemConfiguratorAddToCart={this.handleItemConfiguratorAddToCart}
                onItemMoveToCart={this.handleItemMoveToCart}
                onItemRemove={this.handleItemRemove}
                itemDetailLink={itemDetailLink}
              />
            </div>
          )}
          <div>
            {this.checkPermissions()}
          </div>
        </div>
      </div>
    );
  }
}

export default WishListsPage;
