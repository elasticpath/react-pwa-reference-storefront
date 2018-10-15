/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
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
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import { login } from '../utils/AuthService';
import cortexFetch from '../utils/Cortex';
import './add.promotion.container.less';

const Config = require('Config');

class AddPromotionContainer extends React.Component {
  static propTypes = {
    // data: PropTypes.objectOf(PropTypes.any).isRequired,
    onSubmittedPromotion: PropTypes.func,
    renderAddPromotion: PropTypes.bool,
  }

  static defaultProps = {
    renderAddPromotion: false,
    onSubmittedPromotion: null,
  }

  constructor() {
    super();
    this.state = {
      isPromotionFormOpen: false,
      failedPromotion: false,
      promotionCode: '',
      couponFormLink: 'default',
    };
    this.setPromotionCode = this.setPromotionCode.bind(this);
    this.submitPromotionCode = this.submitPromotionCode.bind(this);
  }

  componentDidMount() {
    this.fetchCouponForm();
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

  fetchCouponForm() {
    login().then(() => {
      cortexFetch('/?zoom=defaultcart:order:couponinfo:couponform', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(res => res.json())
        .then((res) => {
          const couponFormUri = res._defaultcart[0]._order[0]._couponinfo[0]._couponform[0].links.find(
            link => link.rel === 'applycouponaction',
          ).uri;
          this.setState({
            couponFormLink: couponFormUri,
          });
        });
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
    const { renderAddPromotion } = this.props;
    if (renderAddPromotion && isPromotionFormOpen) {
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
              <button className="btn btn-add-promotion" type="submit">
                {intl.get('apply-promotion')}
              </button>
              <button className="btn btn-add-promotion" type="button" onClick={() => { this.closePromotionForm(); }}>
                {intl.get('cancel')}
              </button>
            </div>
          </form>
        </div>
      );
    }
    if (renderAddPromotion) {
      return (
        <div className="add-promotion-container">
          <button className="btn btn-add-promotion" type="button" id="open_promotion_form_button" onClick={() => { this.openPromotionForm(); }}>
            {intl.get('add-promotion')}
          </button>
        </div>
      );
    }
    return null;
  }
}
export default AddPromotionContainer;
