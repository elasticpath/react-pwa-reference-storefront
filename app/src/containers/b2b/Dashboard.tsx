
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
import { Link, RouteComponentProps } from 'react-router-dom';
import { adminFetch } from '../../utils/Cortex';
import { login } from '../../utils/AuthService';
import { ReactComponent as AccountIcon } from '../../images/header-icons/account-icon.svg';
import Config from '../../ep.config.json';

import './Dashboard.less';

interface DashboardState {
  admins: any,
  defaultBillingAddress: any,
  defaultShippingAddress: any,
  recentOrders: any,
  accounts: any,
  searchAccounts: string,
  isLoading: boolean,
  showSearchLoader: boolean,
  noSearchResults: boolean,
  isSellerAdmin: boolean,
}

const accountsZoomArray = [
  'accounts',
  'accounts:element',
  'accounts:element:accountmetadata',
  'accounts:element:selfsignupinfo',
  'accounts:element:statusinfo',
  'accounts:element:statusinfo:status',
  'accounts:element:subaccounts',
  'accounts:element:subaccounts:accountform',
  'accounts:element:subaccounts:parentaccount',
  'accounts:element:associateroleassignments',
  'accounts:element:associateroleassignments:element',
  'accounts:element:associateroleassignments:element:associateroleassignments',
  'accounts:element:associateroleassignments:element:roleinfo',
  'accounts:element:associateroleassignments:element:roleinfo:roles',
  'accounts:element:associateroleassignments:element:roleinfo:roles:element',
  'accounts:element:associateroleassignments:element:roleinfo:selector',
  'accounts:element:associateroleassignments:element:associate',
  'accounts:element:associateroleassignments:element:associate:primaryemail',
];

export default class Dashboard extends React.Component<RouteComponentProps, DashboardState> {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      noSearchResults: false,
      showSearchLoader: false,
      defaultBillingAddress: {
        name: 'Inez Larson',
        address: '198 Bendar Knoll',
        city: 'East Nicklaus',
        state: 'Michigan',
        zip: '48002',
        country: 'United States',
      },
      defaultShippingAddress: {
        name: 'Max Wilkerson',
        address: '198 Bendar Knoll',
        city: 'East Nicklaus',
        state: 'Michigan',
        zip: '48002',
        country: 'United States',
      },
      recentOrders: [
        {
          orderId: '170-05-3731',
          date: '03 May 2019',
          shipTo: 'Max Wilkerson',
          orderTotal: '$4628.77',
          status: 'Complete',
        },
        {
          orderId: '170-05-3730',
          date: '01 May 2019',
          shipTo: 'Max Wilkerson',
          orderTotal: '$4308.32',
          status: 'Complete',
        },
        {
          orderId: '170-05-3729',
          date: '27 Apr 2019',
          shipTo: 'Max Wilkerson',
          orderTotal: '$3182.27',
          status: 'Processing',
        },
        {
          orderId: '170-05-3728',
          date: '26 Apr 2019',
          shipTo: 'Christopher Bryan',
          orderTotal: '$2934.03',
          status: 'Processing',
        },
      ],
      accounts: [],
      admins: [],
      searchAccounts: '',
      isSellerAdmin: false,
    };
    this.getAdminData();
    this.setSearchAccounts = this.setSearchAccounts.bind(this);
    this.getSearchAccounts = this.getSearchAccounts.bind(this);
    this.handleEnterKeyPress = this.handleEnterKeyPress.bind(this);
  }

  setSearchAccounts(event) {
    this.setState({ searchAccounts: event.target.value });
  }

  getAdminData() {
    login().then(() => {
      adminFetch(`/?zoom=${accountsZoomArray.join()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
        },
      })
        .then(res => res.json())
        .then((res) => {
          if (res && res._accounts) {
            const accounts = res._accounts[0]._element.map((account) => {
              const uri = account.self.uri.split('/').pop();
              return {
                name: account.name,
                externalId: account._accountmetadata ? account._accountmetadata[0]['external-id'] : null,
                status: account._statusinfo[0]._status[0].status.toLowerCase(),
                uri,
              };
            });
            let isSellerAdmin = false;
            if (res._accounts[0]._element[0]._accountmetadata) {
              isSellerAdmin = true;
            }
            const map = new Map();
            res._accounts[0]._element.reduce((accum, account) => {
              const associates = account._associateroleassignments[0]._element;
              if (!associates) return accum;

              associates.forEach((associate) => {
                if (associate._roleinfo[0]._roles[0]._element && associate._roleinfo[0]._roles[0]._element[0].name === 'BUYER_ADMIN') {
                  const { name } = associate._associate[0];
                  const { email } = associate._associate[0]._primaryemail[0];
                  map.set(email, { name, email });
                }
              });
              return accum;
            }, []);
            const admins = Array.from(map.values());

            this.setState({
              accounts, admins, isLoading: false, noSearchResults: false, isSellerAdmin,
            });
          }
        });
    });
  }

  getSearchAccounts() {
    const { searchAccounts } = this.state;
    this.setState({ showSearchLoader: true });
    login().then(() => {
      adminFetch('/accounts/am/search/form?followlocation&format=standardlinks,zoom.nodatalinks', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
        },
        body: JSON.stringify({ keywords: searchAccounts, page: '1', 'page-size': '10' }),
      })
        .then(data => data.json())
        .then((data) => {
          adminFetch(`${data.self.uri}?zoom=element,element:statusinfo:status`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
            },
            body: JSON.stringify({ keywords: searchAccounts, page: '1', 'page-size': '10' }),
          })
            .then(res => res.json())
            .then((res) => {
              adminFetch(`${res.self.uri}?zoom=element,element:statusinfo:status`, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
                },
              })
                .then(searchResult => searchResult.json())
                .then((searchResult) => {
                  if (searchResult && searchResult._element) {
                    const accounts = searchResult._element.map((account) => {
                      const uri = account.self.uri.split('/').pop();
                      return {
                        name: account.name,
                        externalId: account._accountmetadata[0]['external-id'],
                        status: account._statusinfo[0]._status[0].status.toLowerCase(),
                        uri,
                      };
                    });
                    let isSellerAdmin = false;
                    if (res._accounts[0]._element[0]._accountmetadata) {
                      isSellerAdmin = true;
                    }
                    this.setState({
                      accounts,
                      showSearchLoader: false,
                      noSearchResults: false,
                      isSellerAdmin,
                    });
                  } else {
                    this.setState({ showSearchLoader: false, noSearchResults: true });
                  }
                })
                .catch((error) => {
                  // eslint-disable-next-line no-console
                  console.error(error.message);
                });
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.error(error.message);
            });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  handleEnterKeyPress(e) {
    if (e.keyCode === 13) {
      this.getSearchAccounts();
    }
  }

  handleAccountClicked(account: any) {
    const { history } = this.props;
    history.push(`/b2b/account/${account.uri}`);
  }

  render() {
    const {
      admins,
      defaultBillingAddress,
      defaultShippingAddress,
      recentOrders,
      accounts,
      isLoading,
      searchAccounts,
      showSearchLoader,
      noSearchResults,
      isSellerAdmin,
    } = this.state;

    return (
      <div className="dashboard-component">
        {!isLoading ? (
          <div>
            <div className="admin-address-book">
              <div className="b2b-section section-1 admin-section">
                <div className="section-header">
                  <div className="section-title">{intl.get('admins')}</div>
                </div>
                <div className="section-content">
                  {admins.slice(0, 2).map(admin => (
                    <div key={admin.email} className="user-info">
                      <AccountIcon className="user-icon" />
                      <div className="user-details">
                        <div className="user-email">{admin.email}</div>
                        <div className="user-name">{admin.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="b2b-section section-2 address-book-section" style={{ border: 'none' }}>
                {/* <div className="section-header"> */}
                {/* <div className="section-title">{intl.get('addresses')}</div> */}
                {/* <div className="section-header-right"> */}
                {/* /!*<Link to="/">{intl.get('edit')}</Link>*!/ */}
                {/* </div> */}
                {/* </div> */}
                {/* <div className="section-content"> */}
                {/* <div className="address default-billing"> */}
                {/* <div className="address-title">{intl.get('default-billing')}</div> */}
                {/* <div className="address-content"> */}
                {/* <div className="name-line">{defaultBillingAddress.name}</div> */}
                {/* <div className="address-line">{defaultBillingAddress.address}</div> */}
                {/* <div className="state-line"> */}
                {/* {defaultBillingAddress.city} */}
                {/* ,&nbsp; */}
                {/* {defaultBillingAddress.state} */}
                {/* ,&nbsp; */}
                {/* {defaultBillingAddress.zip} */}
                {/* </div> */}
                {/* <div className="country-line">{defaultBillingAddress.country}</div> */}
                {/* </div> */}
                {/* </div> */}
                {/* <div className="address default-shipping"> */}
                {/* <div className="address-title">{intl.get('default-shipping')}</div> */}
                {/* <div className="address-content"> */}
                {/* <div className="name-line">{defaultShippingAddress.name}</div> */}
                {/* <div className="address-line">{defaultShippingAddress.address}</div> */}
                {/* <div className="state-line"> */}
                {/* {defaultShippingAddress.city} */}
                {/* ,&nbsp; */}
                {/* {defaultShippingAddress.state} */}
                {/* ,&nbsp; */}
                {/* {defaultShippingAddress.zip} */}
                {/* </div> */}
                {/* <div className="country-line">{defaultShippingAddress.country}</div> */}
                {/* </div> */}
                {/* </div> */}
                {/* </div> */}
              </div>
            </div>
            {/* <div className="b2b-section recent-orders"> */}
            {/* <div className="section-header"> */}
            {/* <div className="section-title">{intl.get('recent-orders')}</div> */}
            {/* <div className="section-header-right"> */}
            {/* /!*<Link to="/">{intl.get('view-all')}</Link>*!/ */}
            {/* </div> */}
            {/* </div> */}
            {/* <div className="section-content"> */}
            {/* <table className="b2b-table recent-orders-table"> */}
            {/* <thead> */}
            {/* <tr> */}
            {/* <th className="order-id"> */}
            {/* {intl.get('order')} */}
            {/* <span className="mobile-table-title"> */}
            {/* {' '} */}
            {/* & */}
            {/* {' '} */}
            {/* {intl.get('date')} */}
            {/* </span> */}
            {/* </th> */}
            {/* <th className="date">{intl.get('date')}</th> */}
            {/* <th className="ship-to"> */}
            {/* {intl.get('ship-to')} */}
            {/* <span className="mobile-table-title"> */}
            {/* {' '} */}
            {/* & */}
            {/* {' '} */}
            {/* {intl.get('order-total')} */}
            {/* </span> */}
            {/* </th> */}
            {/* <th className="order-total">{intl.get('order-total')}</th> */}
            {/* <th className="status">{intl.get('status')}</th> */}
            {/* </tr> */}
            {/* </thead> */}
            {/* <tbody> */}
            {/* {recentOrders.map(order => ( */}
            {/* <tr key={order.orderId}> */}
            {/* <td className="order-id">{order.orderId}</td> */}
            {/* <td className="date">{order.date}</td> */}
            {/* <td className="ship-to">{order.shipTo}</td> */}
            {/* <td className="order-total">{order.orderTotal}</td> */}
            {/* <td className="status">{order.status}</td> */}
            {/* </tr> */}
            {/* ))} */}
            {/* </tbody> */}
            {/* </table> */}
            {/* </div> */}
            {/* </div> */}
            <div className="b2b-section accounts">
              <div className="section-header">
                <div className="section-title">{intl.get('accounts')}</div>
                <div className="section-header-right">
                  <div className="accounts-search">
                    <input type="text" placeholder={intl.get('search')} value={searchAccounts} onKeyDown={this.handleEnterKeyPress} onChange={this.setSearchAccounts} />
                    {showSearchLoader && <div className="miniLoader" />}
                  </div>
                </div>
              </div>
              <div className="section-content">
                { !noSearchResults ? (
                  <table className="b2b-table accounts-table">
                    <thead>
                      <tr>
                        <th className="name">
                          {intl.get('name')}
                          {isSellerAdmin && (
                            <span className="mobile-table-title">
                              {' '}
                              &
                              {' '}
                              {intl.get('external-id')}
                            </span>)
                           }
                        </th>
                        {isSellerAdmin && <th className="external-id">{intl.get('external-id')}</th>}
                        <th className="status">{intl.get('status')}</th>
                        <th className="arrow" />
                      </tr>
                    </thead>
                    <tbody>
                      {accounts.map(account => (
                        <tr key={account.uri} onClick={() => this.handleAccountClicked(account)} className="account-list-rows">
                          <td className="name">{account.name}</td>
                          {isSellerAdmin && <td className="external-id">{account.externalId}</td>}
                          <td className="status">
                            <i className={`icons-status ${account.status.toLowerCase()}`} />
                            {intl.get(account.status)}
                          </td>
                          <td className="arrow">
                            <Link to={`/b2b/account/${account.uri}`} className="arrow-btn" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p className="no-results">{intl.get('no-results-found')}</p>}
              </div>
            </div>
          </div>
        ) : (
          <div className="loader" />
        )}
      </div>
    );
  }
}
