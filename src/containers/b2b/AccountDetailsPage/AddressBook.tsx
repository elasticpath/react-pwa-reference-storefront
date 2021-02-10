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
import Modal from 'react-responsive-modal';
import { login } from '../../../hooks/store';
import { cortexFetch } from '../../../components/src/utils/Cortex';
import Config from '../../../ep.config.json';

import './AddressBook.scss';
import AddressFormMain from '../../../components/src/AddressForm/addressform.main';
import ProfileAddressesMain from '../../../components/src/ProfileAddressesWithDefaults/profileaddresses.main';
import { ReactComponent as CloseIcon } from '../../../images/icons/ic_close.svg';

interface AddressBookProps {
  isCreateModalOpen: boolean,
  setIsCreateAddressModalOpen: any,
  handleShowAlert: any,
  accountName: string
}

const zoomArray = [
  'defaultprofile',
  'defaultprofile:addresses',
  'defaultprofile:addresses:addressform',
  'defaultprofile:addresses:element',
  'defaultprofile:addresses:billingaddresses',
  'defaultprofile:addresses:billingaddresses:default',
  'defaultprofile:addresses:billingaddresses:selector',
  'defaultprofile:addresses:billingaddresses:selector:choice',
  'defaultprofile:addresses:billingaddresses:selector:choice:description',
  'defaultprofile:addresses:billingaddresses:selector:choice:selectaction',
  'defaultprofile:addresses:billingaddresses:selector:chosen',
  'defaultprofile:addresses:billingaddresses:selector:chosen:description',
  'defaultprofile:addresses:billingaddresses:selector:chosen:selectaction',
  'defaultprofile:addresses:shippingaddresses',
  'defaultprofile:addresses:shippingaddresses:default',
  'defaultprofile:addresses:shippingaddresses:selector',
  'defaultprofile:addresses:shippingaddresses:selector:choice',
  'defaultprofile:addresses:shippingaddresses:selector:choice:description',
  'defaultprofile:addresses:shippingaddresses:selector:choice:selectaction',
  'defaultprofile:addresses:shippingaddresses:selector:chosen',
  'defaultprofile:addresses:shippingaddresses:selector:chosen:description',
  'defaultprofile:addresses:shippingaddresses:selector:chosen:selectaction',
];

const AddressBook: React.FC<AddressBookProps> = ({
  isCreateModalOpen, setIsCreateAddressModalOpen, handleShowAlert, accountName,
}) => {
  const [accountData, setAccountData] = useState<any>(undefined);
  const [addressData, setAddressData] = useState<any>(undefined);
  const [chosenShippingUri, setChosenShippingUri] = useState<string>('');
  const [chosenBillingUri, setChosenBillingUri] = useState<string>('');
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAccountData = async () => {
    try {
      setIsLoading(true);
      await login();
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      };
      if (Config.Compliance.enable) {
        options.headers['X-Ep-Data-Policy-Segments'] = `${Config.Compliance.dataPolicySegments}`;
      }
      const res = await cortexFetch(`/?zoom=${zoomArray.join()}`, options)
        .then(resData => resData.json());
      if (res && res._defaultprofile) {
        const resAddressData = res._defaultprofile[0]._addresses[0];
        const chosenBillingAddress = resAddressData._billingaddresses[0]._selector && resAddressData._billingaddresses[0]._selector[0]._chosen && resAddressData._billingaddresses[0]._selector[0]._chosen[0]._description[0].self.uri;
        const chosenShippingAddress = resAddressData._shippingaddresses[0]._selector && resAddressData._shippingaddresses[0]._selector[0]._chosen && resAddressData._shippingaddresses[0]._selector[0]._chosen[0]._description[0].self.uri;
        setAccountData(resAddressData);
        setChosenShippingUri(chosenShippingAddress);
        setChosenBillingUri(chosenBillingAddress);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      // eslint-disable-next-line no-console
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, []);

  const handleEditAddress = (addressLink) => {
    setIsEditAddressModalOpen(true);
    setAddressData({ addressUri: addressLink, addressData: accountData });
  };

  const handleCloseAddressModal = () => {
    setIsEditAddressModalOpen(false);
    setIsCreateAddressModalOpen(false);
    setAddressData(undefined);
  };

  const renderNewAddressModal = () => {
    const newOrEdit = (addressData && addressData.addressUri) ? intl.get('edit') : intl.get('new');
    const isChosenBilling = chosenBillingUri === (addressData && addressData.addressUri);
    const isChosenShipping = chosenShippingUri === (addressData && addressData.addressUri);
    let selectactionShippingUri = addressData && accountData._shippingaddresses[0]._selector && accountData._shippingaddresses[0]._selector[0]._choice
    && accountData._shippingaddresses[0]._selector[0]._choice.find(el => addressData.addressUri === el._description[0].self.uri);
    let selectactionBillingUri = addressData && accountData._billingaddresses[0]._selector && accountData._billingaddresses[0]._selector[0]._choice
    && accountData._billingaddresses[0]._selector[0]._choice.find(el => addressData.addressUri === el._description[0].self.uri);
    selectactionShippingUri = selectactionShippingUri && selectactionShippingUri._selectaction[0].self.uri;
    selectactionBillingUri = selectactionBillingUri && selectactionBillingUri._selectaction[0].self.uri;

    return (
      <Modal open={isEditAddressModalOpen || isCreateModalOpen} onClose={handleCloseAddressModal} showCloseIcon={false}>
        <div className="modal-lg new-address-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                {newOrEdit}
                {intl.get('address')}
              </h2>
              <button type="button" aria-label="close" className="close-modal-btn" onClick={handleCloseAddressModal}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <AddressFormMain
                onCloseModal={handleCloseAddressModal}
                handleShowAlert={handleShowAlert}
                fetchData={fetchAccountData}
                addressData={addressData}
                accountName={accountName}
                chosenBilling={isChosenBilling}
                chosenShipping={isChosenShipping}
                selectactionBillingUri={selectactionBillingUri}
                selectactionShippingUri={selectactionShippingUri}
              />
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div>
      {isLoading ? (
        <div className="loader" />
      ) : (
        <div>
          {accountData && !isLoading && (
            <ProfileAddressesMain
              addresses={accountData}
              onChange={fetchAccountData}
              onEditAddress={handleEditAddress}
              chosenShippingUri={chosenShippingUri}
              chosenBillingUri={chosenBillingUri}
            />
          )}
          {!accountData && !isLoading && (
            <div>
              {intl.get('no-saved-address-message')}
            </div>
          )}
          {renderNewAddressModal()}
        </div>
      )}
    </div>
  );
};

export default AddressBook;
