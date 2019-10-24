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
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';

import B2bAccountList from './b2b.accountlist';
import SubAccountData from './HttpResponse/accountData_response.json';
import { mockFetchSubAccount } from './b2b.accountlist.api.mocks';


const accountListData = {
  status: 'ENABLED',
  subAccounts: SubAccountData,
  mainAccountName: 'Accelsmart',
};
const accountName = 'Accelsmart';
const registrationNumber = 'cust-00059';

function getAccountData() {}

function subAccountData() {}

function handleAddSubAccountClicked() {}

storiesOf('B2bAccountList', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('B2bAccountList', () => {
    mockFetchSubAccount();
    return (
      <div className="account-component">
        <B2bAccountList
          getAccountData={this.getAccountData}
          accountListData={accountListData}
          getSubAccountData={this.subAccountData}
          handleAddSubAccountClicked={this.handleAddSubAccountClicked}
          accountName={accountName}
          registrationNumber={registrationNumber}
        />
      </div>
    );
  });
