
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
import ReactRouterPropTypes from 'react-router-prop-types';
import intl from 'react-intl-universal';
import { Link, RouteComponentProps } from 'react-router-dom';
import AlertContainer from '../../../components/src/AlertContainer/alert.container';
import AddressBook from './AddressBook';
import Overviews from './Overviews';
import PaymentInstruments from './PaymentInstruments';
import TabSelection from '../../../components/src/TabSelection/tabselection.main';
import { ReactComponent as ArrowIcon } from '../../../images/icons/arrow_left.svg';
import '../AccountMain.scss';
import './AccountDetailsPage.scss';

interface AccountMainState {
  isShowAlert: boolean
  alertMessageData: { message: string, isSuccess: boolean }
  isCreateAddressModalOpen: boolean
  selectedTab: number
}

interface AccountMainRouterProps {
  uri: string;
}

class AccountDetailsPage extends React.Component<RouteComponentProps<AccountMainRouterProps>, AccountMainState> {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
  };

  constructor(props: any) {
    super(props);
    this.state = {
      isShowAlert: false,
      alertMessageData: { message: '', isSuccess: false },
      isCreateAddressModalOpen: false,
      selectedTab: 0,
    };
    this.renderData = this.renderData.bind(this);
    this.handleShowAlert = this.handleShowAlert.bind(this);
    this.handleHideAlert = this.handleHideAlert.bind(this);
    this.openCreateAddressModal = this.openCreateAddressModal.bind(this);
    this.setIsCreateAddressModalOpen = this.setIsCreateAddressModalOpen.bind(this);
    this.onSelectTab = this.onSelectTab.bind(this);
  }

  onSelectTab = (index) => {
    this.setState({ selectedTab: index });
  }

  handleHideAlert() {
    this.setState({ isShowAlert: false });
  }

  handleShowAlert(message, isSuccess) {
    this.setState({ isShowAlert: true, alertMessageData: { message, isSuccess } });
    setTimeout(this.handleHideAlert, 3200);
  }

  openCreateAddressModal = () => {
    this.setState({ isCreateAddressModalOpen: true });
  }

  setIsCreateAddressModalOpen = () => {
    this.setState({ isCreateAddressModalOpen: false });
  }

  renderData() {
    const { isCreateAddressModalOpen } = this.state;
    const { history } = this.props;

    return ([
      <div key="tab-content">
        <Overviews history={this.props.history} />
      </div>,
      <div key="tab-associates">
        {intl.get('associates')}
      </div>,
      <div key="tab-addresses">
        <AddressBook
          isCreateModalOpen={isCreateAddressModalOpen}
          setIsCreateAddressModalOpen={() => this.setIsCreateAddressModalOpen()}
          handleShowAlert={this.handleShowAlert}
          accountName={history && history.location && history.location.state.accountName && history.location.state.accountName}
        />
      </div>,
      <div key="tab-payment-instruments">
        <PaymentInstruments />
      </div>,
      <div key="tab-purchase-history">
        {intl.get('purchase-history')}
      </div>]
    );
  }

  render() {
    const { history } = this.props;
    const {
      isShowAlert, alertMessageData, selectedTab,
    } = this.state;

    const tabs = [intl.get('overview'), intl.get('associates'), intl.get('address-book'), intl.get('payment-instruments'), intl.get('purchase-history')];
    return (
      <div className="container account-details">
        {isShowAlert ? (
          <AlertContainer messageData={alertMessageData} />
        ) : ''}
        <Link to="/account/accounts" className="back-link" role="button">
          <ArrowIcon className="arrow-icon" />
          {intl.get('back-to-accounts')}
        </Link>
        <br />
        <div className="account-details-header">
          <div className="account-name">
            {history && history.location && history.location.state.accountName && history.location.state.accountName}
          </div>
          {selectedTab === 2 && (
          <button className="ep-btn primary new-address-btn" type="button" data-region="billingAddressButtonRegion" onClick={() => this.openCreateAddressModal()}>
            {intl.get('add-new-address')}
          </button>
          )}
        </div>
        <div className="tab-pane" id="item-form" role="tabpanel">
          <TabSelection tabs={tabs} data={this.renderData()} onSelectTab={index => this.onSelectTab(index)} />
        </div>
      </div>
    );
  }
}

export default AccountDetailsPage;
