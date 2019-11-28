
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

import React, { Component } from 'react';
// eslint-disable-next-line import/no-cycle
import B2bSubAccountListItem from '../B2bSubAccountListItem/b2b.subaccountlistitem';

interface B2bSubAccountListProps {
  /** sub accounts */
    subAccounts: any,
  /** handle get account data */
    getAccountData?: (data: any) => void,
  /** account name */
    accountName: string,
  /** registration number */
    registrationNumber: string,
}


class B2bSubAccountList extends Component<B2bSubAccountListProps> {
    static defaultProps = {
      getAccountData: () => {},
    };

    constructor(props) {
      super(props);

      this.handleAccount = this.handleAccount.bind(this);
    }

    handleAccount(data) {
      const { getAccountData } = this.props;
      getAccountData(data);
    }

    render() {
      const { subAccounts, accountName, registrationNumber } = this.props;

      return (
        <div className="sub-accounts-container">
          {subAccounts._element.map(element => (
            <div key={element.name}>
              <B2bSubAccountListItem handleAccount={this.handleAccount} accountData={element} accountName={accountName} registrationNumber={registrationNumber} />
            </div>
          ))}
        </div>
      );
    }
}

export default B2bSubAccountList;
