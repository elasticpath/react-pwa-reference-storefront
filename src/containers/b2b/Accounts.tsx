
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
import fileDownload from 'js-file-download';
import Modal from 'react-responsive-modal';
import { adminFetch } from '../../utils/Cortex';
import { login } from '../../utils/AuthService';
import { ReactComponent as AccountIcon } from '../../images/header-icons/account-icon.svg';
import { B2bAddAssociatesMenu } from '../../components/src';
import Config from '../../ep.config.json';

import './Accounts.less';

enum MessageType {
  success = 'success',
  error = 'error'
}

interface AccountsState {
  admins: any;
  defaultBillingAddress: any;
  defaultShippingAddress: any;
  recentOrders: any;
  accounts: any;
  searchAccounts: string;
  isLoading: boolean;
  showSearchLoader: boolean;
  noSearchResults: boolean;
  isSellerAdmin: boolean;
  associatesFormUrl?: string;
  isImportDialogOpen: boolean;
  exampleCsvFile: string;
  selectedFile?: HTMLInputElement;
  isUploading: boolean;
  messages: { type: MessageType; text: string; }[];
}

const accountsZoomArray = [
  'accounts',
  'accounts:addassociatesform',
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

export default class Accounts extends React.Component<RouteComponentProps, AccountsState> {
  fileInputRef: React.RefObject<HTMLInputElement>;

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
      isImportDialogOpen: false,
      exampleCsvFile: '',
      selectedFile: undefined,
      isUploading: false,
      associatesFormUrl: undefined,
      messages: [],
    };
    this.getAdminData();
    this.setSearchAccounts = this.setSearchAccounts.bind(this);
    this.getSearchAccounts = this.getSearchAccounts.bind(this);
    this.handleEnterKeyPress = this.handleEnterKeyPress.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.fileInputRef = React.createRef<HTMLInputElement>();
  }

  setSearchAccounts(event) {
    this.setState({ searchAccounts: event.target.value });
  }

  async getAdminData() {
    await login();
    const res = await adminFetch(`/?zoom=${accountsZoomArray.join()}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
      },
    })
      .then(result => result.json());
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

      const associatesFormUrl = `${Config.b2b.authServiceAPI.path}${res._accounts[0]._addassociatesform[0].self.uri}`;
      const exampleCsvFile = await fetch(associatesFormUrl, {
        headers: {
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
          Accept: 'text/csv',
        },
      })
        .then(r => r.text());

      this.setState({ associatesFormUrl, exampleCsvFile });

      this.setState({
        accounts, admins, isLoading: false, noSearchResults: false, isSellerAdmin,
      });
    }
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
          })
            .then(searchResult => searchResult.json())
            .then((searchResult) => {
              if (searchResult && searchResult._element) {
                const accounts = searchResult._element.map((account) => {
                  const uri = account.self.uri.split('/').pop();
                  return {
                    name: account.name,
                    externalId: account._accountmetadata ? account._accountmetadata[0]['external-id'] : null,
                    status: account._statusinfo[0]._status[0].status.toLowerCase(),
                    uri,
                  };
                });
                let isSellerAdmin = false;
                if (data._accounts && data._accounts[0]._element[0]._accountmetadata) {
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
    });
  }

  handleEnterKeyPress(e) {
    if (e.keyCode === 13) {
      this.getSearchAccounts();
    }
  }

  handleAccountClicked(account: any) {
    const { history } = this.props;
    history.push(`/account/account-item/${account.uri}`);
  }

  handleSpreeadsheetClicked() {
    this.setState({ isImportDialogOpen: true });
  }

  handleTemplateClicked() {
    const { exampleCsvFile } = this.state;
    fileDownload(exampleCsvFile, 'example.csv', 'text/csv');
  }

  resetDialog() {
    this.setState({
      isImportDialogOpen: false,
      selectedFile: undefined,
      isUploading: false,
    });
  }

  handleImportDialogClose() {
    this.resetDialog();
  }

  handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ selectedFile: event.target });
  }

  async uploadSelectedFile(): Promise<any> {
    const formData = new FormData();
    const fileInput = this.fileInputRef.current;
    formData.append('associates', new Blob([fileInput.files[0]], { type: 'text/csv' }));

    const options = {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
      },
    };

    const { associatesFormUrl } = this.state;
    return fetch(associatesFormUrl, options)
      .then(
        (result) => {
          if (result.status >= 200 && result.status < 300) {
            return Promise.resolve();
          }

          return result.json()
            .catch(_ => Promise.reject(new Error(intl.get('general-upload-error'))))
            .then((parsedJson) => {
              const errorMsg = parsedJson.messages.map(m => intl.get(`backend-message-${m.id}`) || m['debug-message']).join(' ');
              return Promise.reject(new Error(errorMsg));
            });
        },
        _ => Promise.reject(new Error(intl.get('general-upload-error'))),
      );
  }

  async handleSubmit() {
    const { messages } = this.state;
    this.setState({ isUploading: true });

    try {
      await this.uploadSelectedFile();

      this.setState({ messages: [...messages, { type: MessageType.success, text: intl.get('your-upload-was-successful') }] });
    } catch (err) {
      this.setState({ messages: [...messages, { type: MessageType.error, text: err.message }] });
    }

    this.resetDialog();
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
      selectedFile,
      isUploading,
      exampleCsvFile,
      isImportDialogOpen,
      messages,
      associatesFormUrl,
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
          <div className="page-title">{intl.get('business-account')}</div>
          {associatesFormUrl && (
            <div className="quick-menu">
              <B2bAddAssociatesMenu
                onSpreeadsheetClicked={() => this.handleSpreeadsheetClicked()}
                onTemplateClicked={() => this.handleTemplateClicked()}
              />
            </div>
          )}
        </div>
        <div className="account-description">{intl.get('buyer-admin-has-the-capability')}</div>
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
                            </span>
                          )}
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
            <Modal
              open={isImportDialogOpen}
              onClose={() => this.handleImportDialogClose()}
              classNames={{ modal: 'b2b-import-associate-dialog', closeButton: 'b2b-dialog-close-btn' }}
            >
              <div className="dialog-header">{intl.get('select-your-file')}</div>
              <div className="dialog-content">
                <div className="upload-title">{intl.get('upload-associatess-csv')}</div>
                <div className="chose-btn-container">
                  <input id="file-upload" className="chose-btn" type="file" name="associates" ref={this.fileInputRef} onChange={this.handleFileChange} />
                  <label className="chose-btn-label" htmlFor="file-upload">Choose file</label>
                  <span>{selectedFile ? selectedFile.value.split('\\').pop() : intl.get('no-file-selected')}</span>
                </div>
                <div className="capital-or">{intl.get('capital-or')}</div>
                <div className="download-sample">
                  <a href={`data:text/csv;base64,${btoa(exampleCsvFile)}`} download="example.csv">{intl.get('download')}</a>
                  {' '}
                  {intl.get('a-sample-file')}
                </div>
              </div>
              <div className="dialog-footer">
                <button className="cancel" type="button" onClick={() => this.handleImportDialogClose()}>{intl.get('cancel')}</button>
                <button className="upload" type="submit" disabled={!selectedFile || isUploading} onClick={() => this.handleSubmit()}>{intl.get('upload')}</button>
              </div>
            </Modal>
          </div>
        ) : (
          <div className="loader" />
        )}
      </div>
    );
  }
}
