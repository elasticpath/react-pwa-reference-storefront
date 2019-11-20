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
import { object, text, boolean } from "@storybook/addon-knobs/react";
import { textToFunc } from "../../../storybook/utils/storybookUtils"
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

storiesOf('B2bAccountList', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('B2bAccountList', () => {
    mockFetchSubAccount();

    let getAccountDataFuncText = text('getAccountData','() => {alert("getAccountData invoked")}');
    let getSubAccountDataFuncText = text('getSubAccountData','() => {alert("getSubAccountData invoked")}');
    let handleSubAccountClickedFuncText = text('handleSubAccountClicked','() => {alert("handleSubAccountClicked invoked")}');

    return (
      <div className="account-component">
        <B2bAccountList
          getAccountData={()=>{textToFunc(getAccountDataFuncText)}}
          getSubAccountData={()=>{textToFunc(getSubAccountDataFuncText)}}
          handleAddSubAccountClicked={()=>{textToFunc(handleSubAccountClickedFuncText)}}
          accountListData={object('accountListData', accountListData)}
          accountName={text('accountName', accountName)}
          registrationNumber={text('registrationNumber', registrationNumber)}
        />
      </div>
    );
  });
