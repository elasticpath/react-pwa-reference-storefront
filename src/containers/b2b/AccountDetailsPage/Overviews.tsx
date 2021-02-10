
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

import React, { useState, useEffect } from 'react';
import intl from 'react-intl-universal';
import { cortexFetch } from '../../../components/src/utils/Cortex';
import { login } from '../../../hooks/store';
import * as Config from '../../../ep.config.json';

import '../AccountMain.scss';
import './Overviews.scss';

interface OverviewsProps {
  history: any
}

const zoomArray = [
  'status',
  'identifier',
  'childaccounts',
  'childaccounts:account',
  'childaccounts:element',
  'childaccounts:account:attributes',
  'paymentmethods',
  'attributes',
  'purchases',
];

const Overviews: React.FC<OverviewsProps> = ({ history }) => {
  const [accountData, setAccountData] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShowForm, setIsShowForm] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<any>();
  const [accountUri, setAccountUri] = useState<string>('');
  const [businessName, setBusinessName] = useState<string>('');
  const [businessNumber, setBusinessNumber] = useState<string>('');
  const [accountPhone, setAccountPhone] = useState<string>('');
  const [accountFax, setAccountFax] = useState<string>('');

  const getAccountData = async (uri) => {
    setIsLoading(true);
    const res = await cortexFetch(`${uri}/?zoom=${zoomArray.join()}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
    })
      .then(result => result.json());
    if (res) {
      const fields = [];
      if (res._attributes) {
        // eslint-disable-next-line no-restricted-syntax,guard-for-in
        for (const fieldName in res._attributes[0]) {
          if (typeof res._attributes[0][fieldName] === 'string') {
            fields.push({
              field: fieldName,
              value: res._attributes[0][fieldName],
            });
          }
        }
      }

      setAccountData(res);
      setIsLoading(false);
      setIsShowForm(false);
      setFormFields(fields);
      setAccountUri(uri);
      setBusinessName(res['account-business-name']);
      setBusinessNumber(res['account-business-number']);
      setAccountPhone(res['account-phone']);
      setAccountFax(res['account-fax']);
    }
  };

  const handleEdit = async () => {
    login().then(() => {
      cortexFetch(`${accountUri}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
        body: JSON.stringify({
          'account-business-name': businessName,
          'account-business-number': businessNumber,
          'account-fax': accountPhone,
          'account-phone': accountFax,
        }),
      })
        .then(() => {
          getAccountData(accountUri);
        });
    });
  };

  useEffect(() => {
    const { state } = history.location;
    if (state && state.accountUri) {
      getAccountData(state.accountUri);
    }
  }, [history.location]);

  return (
    <div>
      {isLoading ? (
        <div className="loader" />
      ) : (
        <div>
          <div className="title">
            <p>
              {intl.get('account-details')}
            </p>
            {!isShowForm && (
            <span role="presentation" className="edit-button" onClick={() => setIsShowForm(!isShowForm)}>{intl.get('edit')}</span>
            )}
          </div>
          <div className="account-data-container">
            <ul className="account-data-list">
              <li>
                <span className="row-name">{intl.get('business-name')}</span>
                {isShowForm ? (
                  <input type="string" className="row-input" defaultValue={businessName} onChange={event => setBusinessName(event.target.value)} />
                ) : (
                  <span className="row-value">{accountData && accountData['account-business-name']}</span>
                )}
              </li>
              <li>
                <span className="row-name">{intl.get('business-number')}</span>
                {isShowForm ? (
                  <input key="businessNumber" type="string" className="row-input" value={businessNumber} onChange={event => setBusinessNumber(event.target.value)} />
                ) : (
                  <span className="row-value">{accountData && accountData['account-business-number']}</span>
                )}
              </li>
              <li>
                <span className="row-name">{intl.get('phone-number')}</span>
                {isShowForm ? (
                  <input key="accountPhone" type="string" className="row-input" value={accountPhone} onChange={event => setAccountPhone(event.target.value)} />
                ) : (
                  <span className="row-value">{accountData && accountData['account-phone']}</span>
                )}
              </li>
              <li>
                <span className="row-name">{intl.get('fax')}</span>
                {isShowForm ? (
                  <input key="accountFax" type="string" className="row-input" value={accountFax} onChange={event => setAccountFax(event.target.value)} />
                ) : (
                  <span className="row-value">{accountData && accountData['account-fax']}</span>
                )}
              </li>
              <li>
                <span className="row-name">{intl.get('status')}</span>
                <span className="row-value">
                  <i className="icons-status enabled" />
                  {accountData && accountData._status[0].status === 'ACTIVE' ? intl.get('enabled') : intl.get('disabled')}
                </span>
              </li>
              <li>
                <span className="row-name">{intl.get('shared-id')}</span>
                <span className="row-value">{accountData && accountData._identifier[0]['shared-id']}</span>
              </li>
            </ul>
            {isShowForm && (
              <div>
                <button className="ep-btn small primary" type="button" onClick={handleEdit}>
                  {intl.get('save')}
                </button>
                <button type="button" className="ep-btn small" onClick={() => setIsShowForm(!isShowForm)}>
                  {intl.get('cancel')}
                </button>
              </div>
            )}
          </div>
          <div className="title">
            <p>
              {intl.get('additional-details')}
            </p>
          </div>
          <div className="account-data-container">
            <ul className="account-data-list">
              {formFields && formFields.map(element => (
                <li key={element.field}>
                  <span className="row-name">{element.field}</span>
                  <span className="row-value">{element.value}</span>
                </li>
              ))
              }
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overviews;
