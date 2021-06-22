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

import './SettingDefaultAddress.scss';
import { ReactComponent as CloseIcon } from '../../../images/icons/ic_close.svg';
import { login } from '../../../hooks/store';
import { cortexFetch } from '../../../components/src/utils/Cortex';
import Config from '../../../ep.config.json';

interface SettingDefaultAddressProps {
  addressData: any,
  isDefaultAddressModalOpen: boolean,
  handleCloseAddressModal: () => void,
  onSaveAddress: () => void,
  handleShowAlert?: (...args: any[]) => any,
}

const SettingDefaultAddress: React.FC<SettingDefaultAddressProps> = (props) => {
  const {
    isDefaultAddressModalOpen, addressData, handleCloseAddressModal, onSaveAddress, handleShowAlert,
  } = props;
  const [selectedShipping, setSelectedShipping] = useState<string>('');
  const [shippingData, setShippingData] = useState<any>({});
  const [selectedBilling, setSelectedBilling] = useState<string>('');
  const [billingData, setBillingData] = useState<any>({});
  const [isMiniLoader, setIsMiniLoader] = useState<boolean>(false);
  const [sameAsShipping, setSameAsShipping] = useState<boolean>(false);
  const getFullAddress = el => el && `${el.address['street-address']}, ${el.address.locality}, ${el.address['country-name']}, ${el.address.region}, ${el.address['postal-code']}`;

  useEffect(() => {
    if (addressData) {
      const chosenBillingAddress = addressData._billingaddresses[0]._selector && addressData._billingaddresses[0]._selector[0]._chosen && addressData._billingaddresses[0]._selector[0]._chosen[0]._description[0];
      const chosenShippingAddress = addressData._shippingaddresses[0]._selector && addressData._shippingaddresses[0]._selector[0]._chosen && addressData._shippingaddresses[0]._selector[0]._chosen[0]._description[0];
      setShippingData(chosenShippingAddress);
      setSelectedShipping(getFullAddress(chosenShippingAddress));
      setBillingData(chosenBillingAddress);
      setSelectedBilling(getFullAddress(chosenBillingAddress));
    }
  }, [addressData]);

  const submitAddress = async (event) => {
    event.preventDefault();
    setIsMiniLoader(true);
    let selectactionShippingUri = addressData && addressData._shippingaddresses[0]._selector && addressData._shippingaddresses[0]._selector[0]._choice
      && addressData._shippingaddresses[0]._selector[0]._choice.find(el => shippingData.self.uri === el._description[0].self.uri);
    selectactionShippingUri = selectactionShippingUri && selectactionShippingUri._selectaction[0].self.uri;
    let selectactionBillingUri;
    if (sameAsShipping) {
      selectactionBillingUri = addressData && addressData._billingaddresses[0]._selector && addressData._billingaddresses[0]._selector[0]._choice
        && addressData._billingaddresses[0]._selector[0]._choice.find(el => shippingData.self.uri === el._description[0].self.uri);
      selectactionBillingUri = selectactionBillingUri && selectactionBillingUri._selectaction[0].self.uri;
    } else if (billingData) {
      selectactionBillingUri = addressData && addressData._billingaddresses[0]._selector && addressData._billingaddresses[0]._selector[0]._choice
        && addressData._billingaddresses[0]._selector[0]._choice.find(el => billingData.self.uri === el._description[0].self.uri);
      selectactionBillingUri = selectactionBillingUri && selectactionBillingUri._selectaction[0].self.uri;
    }
    try {
      await login();
      if (selectactionShippingUri) {
        await cortexFetch(selectactionShippingUri,
          {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
            },
            body: JSON.stringify({}),
          });
      }
      if (selectactionBillingUri) {
        await cortexFetch(selectactionBillingUri,
          {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
            },
            body: JSON.stringify({}),
          });
      }
      await handleShowAlert(intl.get('addresses-are-successfully-updated'), true);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error.message);
    } finally {
      await onSaveAddress();
      setIsMiniLoader(false);
    }
  };

  const onSelectShipping = (value) => {
    setShippingData(value);
    setSelectedShipping(getFullAddress(value));
  };

  const onSelectBilling = (value) => {
    setBillingData(value);
    setSelectedBilling(getFullAddress(value));
  };

  const handleSameAsShipping = () => (
    setSameAsShipping(!sameAsShipping)
  );

  return (
    <Modal open={isDefaultAddressModalOpen} onClose={handleCloseAddressModal} showCloseIcon={false}>
      <div className="modal-lg default-address-modal">
        <div>
          <div className="modal-header">
            <h2 className="modal-title">
              {intl.get('ship-to-bill-to')}
            </h2>
            <button type="button" aria-label="close" className="close-modal-btn" onClick={handleCloseAddressModal}>
              <CloseIcon />
            </button>
          </div>
          <div className="modal-body">
            <p className="sub-title">
              {intl.get('please-assign-default-address')}
            </p>
            <div className="dropdown cart-selection-dropdown">
              <span className="required-label">
                  *
              </span>
              {' '}
              {intl.get('ship-to-address')}
              <button
                className="ep-btn btn-address-method dropdown-toggle"
                data-toggle="dropdown"
                disabled={false}
                type="button"
              >
                {selectedShipping}
              </button>
              <div className="dropdown-menu cart-selection-menu">
                <div className="cart-selection-menu-wrap">
                  {addressData && addressData._element && addressData._element.map(el => (
                    <option key={el.self.uri} value={el} className="address-option" onClick={() => onSelectShipping(el)}>
                      {getFullAddress(el)}
                    </option>
                  ))}
                </div>
              </div>
            </div>
            <div className="dropdown cart-selection-dropdown">
              <span className="required-label">
                  *
              </span>
              {' '}
              {intl.get('bill-to-address')}
              <div className="role-checkbox">
                <input id="sameAsShip" className="style-checkbox default-checkbox" type="checkbox" checked={sameAsShipping} onChange={() => handleSameAsShipping()} />
                <label htmlFor="sameAsShip" />
                <label htmlFor="sameAsShip" className="role-title">{intl.get('same-as-ship-to')}</label>
              </div>
              <button
                className="ep-btn btn-address-method dropdown-toggle"
                data-toggle="dropdown"
                disabled={sameAsShipping}
                type="button"
              >
                {selectedBilling}
              </button>
              <div className="dropdown-menu cart-selection-menu">
                <div className="cart-selection-menu-wrap">
                  {addressData && addressData._element && addressData._element.map(el => (
                    <option key={el.self.uri} value={el} className="address-option" onClick={() => onSelectBilling(el)}>
                      {getFullAddress(el)}
                    </option>
                  ))}
                </div>
              </div>
            </div>
            <div className="dialog-footer btn-container">
              <button className="ep-btn cancel" type="button" onClick={handleCloseAddressModal}>{intl.get('cancel')}</button>
              <button disabled={!shippingData} className="ep-btn primary" type="button" onClick={event => submitAddress(event)}>
                {intl.get('save')}
              </button>
            </div>
          </div>
        </div>
        {isMiniLoader && (
          <div className="loader-wrapper">
            <div className="miniLoader" />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SettingDefaultAddress;
