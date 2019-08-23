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
import * as cortex from '@elasticpath/cortex-client';
import { ClientContext } from '../ClientContext';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

import './add.promotion.container.less';

let Config: IEpConfig | any = {};
let intl = { get: str => str };

interface AddPromotionContainerProps {
  data: {
      [key: string]: any
  },
  onSubmittedPromotion: (...args: any[]) => any,
}

interface AddPromotionContainerState {
  isPromotionFormOpen: boolean,
  failedPromotion: boolean,
  promotionCode: string,
}

class AddPromotionContainer extends React.Component<AddPromotionContainerProps, AddPromotionContainerState> {
  static contextType = ClientContext;

  client: cortex.IClient;

  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    ({ intl } = getConfig());
    this.state = {
      isPromotionFormOpen: false,
      failedPromotion: false,
      promotionCode: '',
    };
    this.setPromotionCode = this.setPromotionCode.bind(this);
    this.submitPromotionCode = this.submitPromotionCode.bind(this);
  }

  async componentDidMount() {
    this.client = this.context;
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

  async submitPromotionCode(event) {
    event.preventDefault();
    const { onSubmittedPromotion } = this.props;
    const { promotionCode } = this.state;

    const root = await this.client.root().fetch(
      {
        defaultcart: {
          order: {
            couponinfo: {
              couponform: {},
            },
          },
        },
      },
    );

    try {
      const couponInfo = await root.defaultcart.order.couponinfo.couponform({
        couponId: '',
        parentId: '',
        parentType: '',
        code: promotionCode,
      }).fetch({});
      this.setState({ failedPromotion: false }, () => {
        this.closePromotionForm();
        onSubmittedPromotion();
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      this.setState({ failedPromotion: true });
    }
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
