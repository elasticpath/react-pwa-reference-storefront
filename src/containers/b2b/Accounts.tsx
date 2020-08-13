
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
import { RouteComponentProps } from 'react-router-dom';
import { cortexFetch } from '../../components/src/utils/Cortex';
import { login } from '../../hooks/store';
import { ReactComponent as AccountIcon } from '../../images/header-icons/account-icon.svg';
import Config from '../../ep.config.json';

import './Accounts.scss';

enum MessageType {
  success = 'success',
  error = 'error'
}

interface AccountsState {
  admins: any;
  /* defaultBillingAddress: any;
  defaultShippingAddress: any;
  recentOrders: any; */
  accounts: any;
  searchAccounts: string;
  isLoading: boolean;
  showSearchLoader: boolean;
  noSearchResults: boolean;
  isSellerAdmin: boolean;
  messages: { type: MessageType; text: string; }[];
}

const zoomArray = [
  'element',
  'element:attributes',
  'element:identifier',
];

export default class Accounts extends React.Component<RouteComponentProps, AccountsState> {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      noSearchResults: false,
      showSearchLoader: false,
      /* defaultBillingAddress: {
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
      ], */
      accounts: [],
      admins: [],
      searchAccounts: '',
      isSellerAdmin: false,
      messages: [],
    };
    this.getAdminData();
    this.setSearchAccounts = this.setSearchAccounts.bind(this);
    this.getSearchAccounts = this.getSearchAccounts.bind(this);
    this.handleEnterKeyPress = this.handleEnterKeyPress.bind(this);
  }

  setSearchAccounts(event) {
    this.setState({ searchAccounts: event.target.value });
  }

  async getAdminData() {
    await login();
    const res = await cortexFetch(`/accounts/${Config.cortexApi.scope}/?zoom=${zoomArray.join()}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
    })
      .then(result => result.json());
    if (res && res._element) {
      this.setState({
        accounts: res, isLoading: false,
      });
    }
  }

  getSearchAccounts() {
    this.setState({ showSearchLoader: true });
  }

  handleEnterKeyPress(e) {
    if (e.keyCode === 13) {
      this.getSearchAccounts();
    }
  }

  render() {
    const {
      admins,
      accounts,
      isLoading,
      searchAccounts,
      showSearchLoader,
      noSearchResults,
      isSellerAdmin,
      messages,
    } = this.state;

    return (
      <div className="dashboard-component">
        <div className="message-boxes">
          {messages.map((message, index) => (
            /* eslint-disable-next-line react/no-array-index-key */
            <div key={index} className={`message-box ${message.type.toString()}`}>
              <div className="container">
                <div className="message">
                  {message.text}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="b2b-header">
          <h1 className="page-title">{intl.get('business-account')}</h1>
        </div>
        <div className="account-description">{intl.get('buyer-admin-has-the-capability')}</div>
        {!isLoading ? (
          <div>
            <div className="accounts-search">
              <input type="text" placeholder={intl.get('search-accounts')} aria-label={intl.get('search')} value={searchAccounts} onKeyDown={this.handleEnterKeyPress} onChange={this.setSearchAccounts} />
              {showSearchLoader && <div className="circularLoader" />}
            </div>
            <div className="admin-address-book">
              <div className="b2b-section section-1 admin-section">
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
                            </span>
                          )}
                        </th>
                        <th className="external-id">{intl.get('external-id')}</th>
                        <th className="status">{intl.get('status')}</th>
                        <th className="arrow" />
                      </tr>
                    </thead>
                    <tbody>
                      {accounts._element.map(account => (
                        <tr key={account.self.uri} className="account-list-rows">
                          <td className="name">{account['business-name']}</td>
                          <td className="external-id">{account['business-number']}</td>
                          <td className="status">
                            <i className="icons-status enabled" />
                            {intl.get('enabled')}
                          </td>
                          <td className="arrow">
                            <span className="arrow-btn" />
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
