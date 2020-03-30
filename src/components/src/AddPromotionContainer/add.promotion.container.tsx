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
import { login } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

import './add.promotion.container.less';

let Config: IEpConfig | any = {};

interface AddPromotionContainerProps {
  /** An array of orders for the shopper, where `string` is the URL to the cart data for an order. */
  data: {
    [key: string]: any
  },
  /** Verifies the coupon code and applies a valid coupon to the order. */
  onSubmittedPromotion: (...args: any[]) => any,
}

interface AddPromotionContainerState {
  isPromotionFormOpen: boolean,
  failedPromotion: boolean,
  promotionCode: string,
  couponFormLink: string,
}

class AddPromotionContainer extends Component<AddPromotionContainerProps, AddPromotionContainerState> {
  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    this.state = {
      isPromotionFormOpen: false,
      failedPromotion: false,
      promotionCode: '',
      couponFormLink: '',
    };
    this.setPromotionCode = this.setPromotionCode.bind(this);
    this.submitPromotionCode = this.submitPromotionCode.bind(this);
  }

  componentDidMount() {
    const { data } = this.props;
    if (data._order) {
      const couponFormUri = data._order[0]._couponinfo[0]._couponform[0].links.find(
        link => link.rel === 'applycouponaction',
      ).uri;
      this.setState({
        couponFormLink: couponFormUri,
      });
    }
  }

  setPromotionCode(event) {
    this.setState({ promotionCode: event.target.value });
  }

  openPromotionForm() {
    this.setState({
      isPromotionFormOpen: true,
    });
  }

  closePromotionForm() {
    this.setState({
      isPromotionFormOpen: false,
      failedPromotion: false,
    });
  }

  submitPromotionCode(event) {
    event.preventDefault();
    const { onSubmittedPromotion } = this.props;
    const { couponFormLink, promotionCode } = this.state;
    login().then(() => {
      cortexFetch(couponFormLink, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
        body: JSON.stringify({
          code: promotionCode,
        }),
      }).then((res) => {
        if (res.status === 409) {
          this.setState({ failedPromotion: true });
        } else if (res.status === 201 || res.status === 200 || res.status === 204) {
          this.setState({ failedPromotion: false }, () => {
            this.closePromotionForm();
            onSubmittedPromotion();
          });
        }
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
      });
    });
  }

  render() {
    const {
      isPromotionFormOpen,
      failedPromotion,
    } = this.state;
    if (isPromotionFormOpen) {
      return (
        <div className="add-promotion-container">
          <h2>
            {intl.get('add-promotion-title')}
          </h2>
          <form className="form-horizontal" onSubmit={this.submitPromotionCode}>
            <div>
              <div>
                {failedPromotion ? intl.get('promotion-invalid') : ''}
              </div>
              <div className="form-group">
                <div>
                  <input id="promotion_form_code" name="PromotionCode" className="form-control" type="text" defaultValue="" onChange={this.setPromotionCode} />
                </div>
              </div>
            </div>
            <div className="form-group">
              <button id="apply_promotion" className="btn btn-add-promotion" type="submit">
                {intl.get('apply-promotion')}
              </button>
              <button id="cancel_add_promotion" className="btn btn-add-promotion" type="button" onClick={() => { this.closePromotionForm(); }}>
                {intl.get('cancel')}
              </button>
            </div>
          </form>
        </div>
      );
    }
    return (
      <div className="add-promotion-container">
        <button className="btn btn-add-promotion" type="button" id="open_promotion_form_button" onClick={() => { this.openPromotionForm(); }}>
          {intl.get('add-promotion')}
        </button>
      </div>
    );
  }
}
export default AddPromotionContainer;
