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
import ga from 'react-ga';

import * as Config from '../ep.config.json';

const showCompliance = Config.Compliance.enable;
const isComplianceAccepted = (showCompliance ? localStorage.getItem(`${Config.cortexApi.scope}_Compliance_Accept`) : true);

if (Config.gaTrackingId !== '' && isComplianceAccepted) {
  ga.initialize(Config.gaTrackingId);
  ga.plugin.require('ec');
}

export default Component => class WithAnalytics extends React.Component<any, any> {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
  }

  componentDidMount() {
    const { location } = this.props;
    const page = location.pathname;
    this.trackPageAnalytics(page);
  }

  componentWillReceiveProps(nextProps) {
    const { location } = this.props;
    const currentPage = location.pathname;
    const { pathname } = nextProps.location;
    const nextPage = pathname;
    if (currentPage !== nextPage) this.trackPageAnalytics(nextPage);
  }

  trackPageAnalytics = (page) => {
    if (Config.gaTrackingId !== '' && isComplianceAccepted) {
      ga.set({ page });
      ga.pageview(page);
    }
  };

  render() {
    return <Component {...this.props} />;
  }
};

export function isAnalyticsConfigured() {
  if (Config.gaTrackingId !== '' && isComplianceAccepted) {
    return true;
  }
  return false;
}

export function trackAddItemAnalytics(idInput, nameInput, skuInput, priceInput, categoryInput, quantityInput) {
  ga.plugin.execute('ec', 'addProduct', {
    id: skuInput,
    name: nameInput,
    price: priceInput,
    category: categoryInput,
    quantity: quantityInput,
  });
}

export function trackAddImpression(nameInput, skuInput, priceInput, categoryInput, quantityInput) {
  ga.plugin.execute('ec', 'addImpression', {
    id: skuInput,
    name: nameInput,
    price: priceInput,
    category: categoryInput,
    quantity: quantityInput,
  });
}

export function trackAddTransactionAnalytics(idInput, revenueInput, shippingInput, taxInput) {
  ga.plugin.execute('ec', 'setAction', 'purchase', {
    id: idInput, // Should be same ID as trackAddItemAnalytics to connect the transaction
    revenue: revenueInput, // Total cost of transaction
    shipping: shippingInput,
    tax: taxInput,
  });
}

export function setDetailAnalytics() {
  ga.plugin.execute('ec', 'setAction', 'detail');
}

export function setAddAnalytics() {
  ga.plugin.execute('ec', 'setAction', 'add');
}

export function setRemoveAnalytics() {
  ga.plugin.execute('ec', 'setAction', 'remove');
}

export function sendAddToCartAnalytics() {
  ga.plugin.execute('send', 'event', 'UX', 'click');
}

export function sendRemoveFromCartAnalytics() {
  ga.plugin.execute('send', 'event', 'UX', 'click');
}

export function sendAnalytics() {
  ga.plugin.execute('send', 'event', 'pageview');
}

export const trackUser = userId => ga.set({ userId });

export const trackEvent = (category, action, label) => ga.event({ category, action, label });
