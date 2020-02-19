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
import Modal from 'react-responsive-modal';
import fileDownload from 'js-file-download';
import { B2bAddAssociatesMenu, B2bSideMenu } from '../../components/src/index';
import RouteWithSubRoutes from '../../RouteWithSubRoutes';
import { adminFetch, cortexFetch } from '../../utils/Cortex';
import * as Config from '../../ep.config.json';

import './B2BMain.less';

interface B2BMainProps {
  routes: {
    [key: string]: any
  },
  location: {
    [key: string]: any
  },
}

interface B2BMainState {
  associatesFormUrl?: string;
  showRequisitionListsLink: boolean;
  isLocationLoading: boolean;
}

export default class B2BMain extends React.Component<B2BMainProps, B2BMainState> {
  constructor(props) {
    super(props);

    this.state = {
      associatesFormUrl: undefined,
      showRequisitionListsLink: false,
      isLocationLoading: false,
    };
  }

  async componentDidMount() {
    this.setState({ isLocationLoading: true });
    try {
      await this.fetchRequisitionListsData();
      const result = await adminFetch('/?zoom=accounts,accounts:addassociatesform', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
        },
      })
        .then(r => r.json());

      if (result
      && result._accounts instanceof Array
      && result._accounts.length > 0
      && result._accounts[0]._addassociatesform instanceof Array
      && result._accounts[0]._addassociatesform[0]
      && result._accounts[0]._addassociatesform[0].self
      ) {
        const associatesFormUrl = `${Config.b2b.authServiceAPI.path}${result._accounts[0]._addassociatesform[0].self.uri}`;
        this.setState({ associatesFormUrl });
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
    const { routes, location } = this.props;
    const {
      associatesFormUrl,
      showRequisitionListsLink,
      isLocationLoading,
    } = this.state;

    const sideMenuItems = [
      // { to: '/b2b/address-book', children: 'address-book' },
      // { to: '/b2b/orders', children: 'orders' },
      // { to: '/b2b/approvals', children: 'approvals' },
      // { to: '/b2b/invitations', children: 'invitations' },
      // { to: '/b2b/requisition-lists', children: 'requisition-lists' },
      // { to: '/b2b/quotes', children: 'quotes' },
    ];

    if (associatesFormUrl) {
      sideMenuItems.push({ to: '/b2b', children: 'accounts' });
    }

    if (showRequisitionListsLink) {
      sideMenuItems.push({ to: '/b2b/requisition-lists', children: 'requisition-lists', title: intl.get('requisition-lists') });
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
