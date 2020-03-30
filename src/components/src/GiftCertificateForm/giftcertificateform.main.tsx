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
import intl from 'react-intl-universal';
import Modal from 'react-responsive-modal';
import { login } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

import './giftcertificateform.main.less';

let Config: IEpConfig | any = {};

interface GiftcertificateFormMainProps {
  /** handle update certificate data */
  updateCertificate: (...args: any[]) => any,
}

interface GiftcertificateFormMainState {
  open: boolean,
  giftCertificatesCode: string,
  giftCertificatesCodeArr: any[],
  giftCertificateEntity: any[],
  chosenGiftCertificates: any[],
  showErrorMsg: boolean,
  showLoader: boolean,
}

class GiftcertificateFormMain extends Component<GiftcertificateFormMainProps, GiftcertificateFormMainState> {
  constructor(props) {
    super(props);

    const epConfig = getConfig();
    Config = epConfig.config;

    this.state = {
      open: false,
      giftCertificatesCode: '',
      giftCertificatesCodeArr: [],
      giftCertificateEntity: [],
      chosenGiftCertificates: [],
      showErrorMsg: false,
      showLoader: false,
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.setGiftCertificatesCode = this.setGiftCertificatesCode.bind(this);
    this.getGiftCertificateEntity = this.getGiftCertificateEntity.bind(this);
  }

  componentDidMount() {
    const savedGiftCertificates = (localStorage.getItem('giftCertificatesCodeArr') !== null && localStorage.getItem('giftCertificatesCodeArr') !== '')
      ? JSON.parse(localStorage.getItem('giftCertificatesCodeArr')) : [];
    localStorage.removeItem('chosenGiftCertificatesArr');
    savedGiftCertificates.forEach((el) => {
      login().then(() => {
        cortexFetch(`/giftcertificates/${Config.cortexApi.scope}/lookup/form?followlocation=true`,
          {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
            },
            body: JSON.stringify({
              'gift-certificate-code': el,
            }),
          })
          .then(res => res.json())
          .then((res) => {
            if (res.code && res.balance > 0) {
              const data = { ...res, isChecked: false };
              this.setState(prevState => ({
                giftCertificateEntity: [...prevState.giftCertificateEntity, data],
                giftCertificatesCodeArr: [...prevState.giftCertificatesCodeArr, data.code],
              }));
            } else {
              const giftCertificatesCode = JSON.parse(localStorage.getItem('giftCertificatesCodeArr'));
              const filteredGiftCertificatesCode = giftCertificatesCode.filter(element => element !== res.code);
              localStorage.setItem('giftCertificatesCodeArr', JSON.stringify(filteredGiftCertificatesCode));
            }
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error.message);
          });
      });
    });
  }

  setGiftCertificatesCode(event) {
    this.setState({ giftCertificatesCode: event.target.value, showErrorMsg: false });
  }

  getGiftCertificateEntity() {
    const { giftCertificatesCode, giftCertificateEntity } = this.state;
    if (giftCertificateEntity.filter(el => el.code === giftCertificatesCode).length === 0) {
      this.setState({ showLoader: true });
      login().then(() => {
        cortexFetch(`/giftcertificates/${Config.cortexApi.scope}/lookup/form?followlocation=true`,
          {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
            },
            body: JSON.stringify({
              'gift-certificate-code': giftCertificatesCode,
            }),
          })
          .then(res => res.json())
          .then((res) => {
            if (res.code) {
              const data = { ...res, isChecked: false };
              this.setState(prevState => ({
                open: false,
                giftCertificatesCode: '',
                giftCertificateEntity: [...prevState.giftCertificateEntity, data],
                showErrorMsg: false,
                giftCertificatesCodeArr: [...prevState.giftCertificatesCodeArr, data.code],
                showLoader: false,
              }));
              const { giftCertificatesCodeArr } = this.state;
              localStorage.setItem('giftCertificatesCodeArr', JSON.stringify(giftCertificatesCodeArr));
            } else {
              this.setState({ showErrorMsg: true, showLoader: false });
            }
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error.message);
          });
      });
    } else {
      this.setState({ showErrorMsg: true });
    }
  }

  handleCloseModal() {
    this.setState({ open: false });
  }

  handleOpenModal() {
    this.setState({ open: true });
  }

  handleCheck(el, index) {
    const { updateCertificate } = this.props;
    const { giftCertificateEntity, chosenGiftCertificates } = this.state;
    const checked = !el.isChecked;
    const giftCertificateEntityArr = [...giftCertificateEntity];
    giftCertificateEntityArr[index] = { ...giftCertificateEntityArr[index], isChecked: checked };
    this.setState({ giftCertificateEntity: giftCertificateEntityArr });
    const giftCertificateEntityCheckedArr = giftCertificateEntityArr.filter(giftCard => giftCard.isChecked === true);
    updateCertificate(giftCertificateEntityCheckedArr);
    if (checked) {
      const chosenGiftCertificatesArr = [...chosenGiftCertificates, el.code];
      this.setState({ chosenGiftCertificates: chosenGiftCertificatesArr });
      localStorage.setItem('chosenGiftCertificatesArr', JSON.stringify(chosenGiftCertificatesArr));
    } else {
      const newChosenGiftCertificatesArr = [...chosenGiftCertificates];
      const chosenGiftCardIndex = newChosenGiftCertificatesArr.indexOf(el.code);
      if (chosenGiftCardIndex !== -1) {
        newChosenGiftCertificatesArr.splice(chosenGiftCardIndex, 1);
        this.setState({ chosenGiftCertificates: newChosenGiftCertificatesArr });
        localStorage.setItem('chosenGiftCertificatesArr', JSON.stringify(newChosenGiftCertificatesArr));
      }
    }
  }

  handleDelete(index) {
    const { updateCertificate } = this.props;
    const { giftCertificateEntity, giftCertificatesCodeArr, chosenGiftCertificates } = this.state;
    const newGiftCertificateEntity = [...giftCertificateEntity];
    newGiftCertificateEntity.splice(index, 1);
    this.setState({ giftCertificateEntity: newGiftCertificateEntity });
    const giftCertificateEntityCheckedArr = newGiftCertificateEntity.filter(giftCard => giftCard.isChecked === true);
    updateCertificate(giftCertificateEntityCheckedArr);

    const currentGiftCard = giftCertificateEntity[index].code;
    const newGiftCertificatesCodeArr = [...giftCertificatesCodeArr];
    const currentGiftCardIndex = newGiftCertificatesCodeArr.indexOf(currentGiftCard);
    if (currentGiftCardIndex !== -1) {
      newGiftCertificatesCodeArr.splice(index, 1);
      this.setState({ giftCertificatesCodeArr: newGiftCertificatesCodeArr });
      localStorage.setItem('giftCertificatesCodeArr', JSON.stringify(newGiftCertificatesCodeArr));
    }

    const chosenGiftCertificatesArr = [...chosenGiftCertificates];
    const chosenGiftCardIndex = chosenGiftCertificatesArr.indexOf(currentGiftCard);
    if (chosenGiftCardIndex !== -1) {
      chosenGiftCertificatesArr.splice(index, 1);
      this.setState({ chosenGiftCertificates: chosenGiftCertificatesArr });
      localStorage.setItem('chosenGiftCertificatesArr', JSON.stringify(chosenGiftCertificatesArr));
    }
  }

  renderGiftCardsItem() {
    const { giftCertificateEntity } = this.state;
    return giftCertificateEntity.map((el, index) => (
      <li className="profile-gift-card-container" key={`gift_card_${el.code.slice(-4)}`}>
        <div data-region="giftCardComponentRegion" className="profile-gift-card-label-container">
          <div className="gift-card-container">
            <span className="gift-card-number">
              ****-******-
              {el.code.slice(-4)}
            </span>
            <span className="gift-card-amount">
              {el['balance-display']}
            </span>
          </div>
          <div className="checkbox-wrap">
            <label htmlFor={`apply_balance${index}`}>
              <input type="checkbox" id={`apply_balance${index}`} onChange={() => this.handleCheck(el, index)} defaultChecked={el.isChecked} />
              <span className="apply-balance-txt">
                {intl.get('apply-order-balance')}
              </span>
            </label>
          </div>
        </div>
        <button className="ep-btn small profile-delete-gift-card-btn" type="button" onClick={() => this.handleDelete(index)}>
          {intl.get('delete')}
        </button>
      </li>
    ));
  }

  renderGiftCards() {
    const { giftCertificateEntity } = this.state;
    if (giftCertificateEntity.length !== 0) {
      return (
        <ul className="profile-gift-cards-listing">
          {this.renderGiftCardsItem()}
        </ul>
      );
    }
    return (
      <div>
        <p>
          {intl.get('no-gift-cards-message')}
        </p>
      </div>
    );
  }

  render() {
    const {
      open, giftCertificatesCode, showErrorMsg, showLoader,
    } = this.state;

    return (
      <div className="giftCertificateRegions" data-region="giftCertificateRegions">
        <div>
          <h2>
            {intl.get('gift-certificates')}
          </h2>
          {this.renderGiftCards()}
          <button className="ep-btn primary wide new-gift-certificate-btn" type="button" onClick={this.handleOpenModal}>
            {intl.get('add-new-gift-certificate')}
          </button>
        </div>

        <Modal open={open} onClose={this.handleCloseModal}>
          <div className="modal-lg gift-card-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">
                  {intl.get('gift-card')}
                </h2>
              </div>
              <div className="modal-body">
                <form className="form-horizontal">
                  <div className="form-group">
                    <label htmlFor="GiftCertificatesCode" data-el-label="giftCertificate.cardHolderName" className="control-label form-label">
                      {intl.get('gift-certificates-number')}
                    </label>
                    <div className="form-input">
                      <input id="GiftCertificatesCode" name="GiftCertificatesCode" className="form-control" type="text" value={giftCertificatesCode} onChange={this.setGiftCertificatesCode} />
                    </div>
                    {showErrorMsg && (<div className="error-msg">{intl.get('incorrect-gift-card-code')}</div>)}
                  </div>
                  <div className="form-group">
                    <div className="form-input btn-container">
                      <button type="button" onClick={this.handleCloseModal} className="ep-btn cancel-btn">{intl.get('cancel')}</button>
                      <button type="button" onClick={this.getGiftCertificateEntity} className="ep-btn save-btn primary">{intl.get('save')}</button>
                    </div>
                  </div>
                </form>
              </div>
              {showLoader && (
                <div className="loader-wrapper">
                  <div className="miniLoader" />
                </div>
              )}
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default GiftcertificateFormMain;
