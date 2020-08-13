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
import B2bSideMenu from '../components/src/B2bSideMenu/b2b.sidemenu';
import RouteWithSubRoutes from './RouteContainers/RouteWithSubRoutes';
import { cortexFetch } from '../components/src/utils/Cortex';
import * as Config from '../ep.config.json';

import './MyAccountMain.scss';

interface MyAccountMainProps {
  routes: {
    [key: string]: any
  },
  location: {
    [key: string]: any
  },
}

interface MyAccountMainState {
  showAssociatesLink?: boolean;
  showRequisitionListsLink: boolean;
  isLocationLoading: boolean;
}

export default class MyAccountMain extends React.Component<MyAccountMainProps, MyAccountMainState> {
  constructor(props) {
    super(props);

    this.state = {
      showAssociatesLink: false,
      showRequisitionListsLink: false,
      isLocationLoading: false,
    };
  }

  async componentDidMount() {
    this.setState({ isLocationLoading: true });
    try {
      await this.fetchRequisitionListsData();
      if (Config.b2b.enable) {
        const result = await cortexFetch(`/accounts/${Config.cortexApi.scope}/?zoom=element`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
          .then(r => r.json());

        if (result
          && result._element
          && result._element.length > 0
        ) {
          this.setState({ showAssociatesLink: true });
        }
      }

      this.setState({ isLocationLoading: false });
    } catch (e) {
      this.setState({ isLocationLoading: false });
    }
  }

  fetchRequisitionListsData() {
    return cortexFetch('?zoom=itemlistinfo', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
    })
      .then(r => r.json())
      .then((res) => {
        if (res && res._itemlistinfo) {
          this.setState({ showRequisitionListsLink: true });
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
      });
  }

  render() {
    const { routes } = this.props;
    const {
      showAssociatesLink,
      showRequisitionListsLink,
      isLocationLoading,
    } = this.state;

    const sideMenuItems = [];

    sideMenuItems.push(
      { to: '/account', children: 'my-profile' },
      { to: '/account/purchase-history', children: 'purchase-history' },
      { to: '/account/wishlists', children: 'wishlists' },
      { to: '/account/address-book', children: 'address-book', id: 'address-book_item' },
    );

    if (showAssociatesLink) {
      sideMenuItems.push({ to: '/account/accounts', children: 'accounts' });
    }

    if (showRequisitionListsLink) {
      sideMenuItems.push({ to: '/account/requisition-lists', children: 'requisition-lists' });
    }

    return (
      <div className="b2b-main-component">
        <div className="container">
          <div className="b2b-central">
            <div className="b2b-side">
              <B2bSideMenu {...this.props} sideMenuItems={sideMenuItems} isLoading={isLocationLoading} />
            </div>
            <div className="b2b-content">
              {routes.map(route => (
                <RouteWithSubRoutes key={route.path} {...route} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
