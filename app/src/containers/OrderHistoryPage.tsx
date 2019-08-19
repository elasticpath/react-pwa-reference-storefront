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
import intl from 'react-intl-universal';
import * as cortex from '@elasticpath/cortex-client';
import { RouteComponentProps } from 'react-router-dom';
import { ClientContext, PurchaseDetailsMain } from '@elasticpath/store-components';

import './OrderHistoryPage.less';

const zoom: cortex.PurchaseFetch = {
  paymentmeans: {
    element: {},
  },
  shipments: {
    element: {
      destination: {},
      shippingoption: {},
    },
  },
  billingaddress: {},
  appliedpromotions: {
    element: {},
  },
  lineitems: {
    element: {
      item: {
        code: {},
        availability: {},
        definition: {
          options: {
            element: {},
          },
        },
        addtocartform: {},
        price: {},
      },
      options: {
        element: {
          value: {},
        },
      },
      components: {
        element: {
          item: {
            addtocartform: {},
            availability: {},
            definition: {},
            code: {},
          },
        },
      },
    },
  },
};

interface OrderHistoryPageProps extends React.Component<RouteComponentProps> {
    match: {
        [key: string]: any
    },
    history: any,
}
interface OrderHistoryPageState {
    purchaseData: any,
}

class OrderHistoryPage extends React.Component<OrderHistoryPageProps, OrderHistoryPageState> {
  static contextType = ClientContext;

  client: cortex.IClient;

  constructor(props) {
    super(props);
    this.state = {
      purchaseData: undefined,
    };
    this.moveToCart = this.moveToCart.bind(this);
  }

  componentDidMount() {
    this.client = this.context;
    this.fetchPurchaseData();
  }

  async fetchPurchaseData() {
    const { match } = this.props;
    const purchaseNumber = decodeURIComponent(match.params.url);

    const root = await this.client.root().fetch({
      defaultcart: {
        additemstocartform: {},
      },
      lookups: {
        purchaselookupform: {},
      },
    });

    const purchase = await root.lookups.purchaselookupform({ purchaseNumber }).fetch(zoom);

    this.setState({
      purchaseData: { ...purchase, defaultcart: root.defaultcart },
    });
  }

  moveToCart() {
    const { history } = this.props;
    history.push('/mybag');
  }

  render() {
    const { purchaseData } = this.state;
    const itemDetailLink = '/itemdetail';
    if (purchaseData) {
      return (
        <div>
          <div className="app-main" style={{ display: 'block' }}>
            <div className="container">
              <h2 className="view-title">
                {intl.get('purchase-details')}
              </h2>
              <PurchaseDetailsMain data={purchaseData} itemDetailLink={itemDetailLink} onMoveToCart={this.moveToCart} onConfiguratorAddToCart={this.moveToCart} onReorderAllProducts={this.moveToCart} />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="loader" />
      </div>
    );
  }
}

export default OrderHistoryPage;
