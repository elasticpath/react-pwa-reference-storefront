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

import packageJson from '../../package.json';

export interface IEpConfig {
  cortexApi: {
    path: string,
    scope: string,
    pathForProxy: string,
    reqTimeout: string
  },
  supportedLocales: Array<{
    value: string,
    name: string
  }>,
  defaultLocaleValue: string,
  supportedCurrencies: Array<{
      value: string,
      name: string
  }>,
  defaultCurrencyValue: string,
  skuImagesUrl: string,
  siteImagesUrl: string,
  enableOfflineMode: boolean,
  b2b: {
    enable: boolean,
    authServiceAPI: {
      path: string,
      pathForProxy: string,
      reqTimeout: string
    },
    keycloak: {
      callbackUrl: string,
      loginRedirectUrl: string,
      logoutRedirectUrl: string,
      'client_id': string
    }
  },
  gaTrackingId: string,
  arKit: {
    enable: boolean,
    skuArImagesUrl: string
  },
  indi: {
    enable: boolean,
    carousel: {
      apikey: string,
      id: string,
      size: string,
      theme: string,
      'round_corners': boolean,
      'show_title': boolean,
      'show_views': boolean,
      'show_likes': boolean,
      'show_buzz': boolean,
      animate: boolean
    },
    productReview: {
      'submit_button_url': string,
      'thumbnail_url': string
    },
    brandAmbassador: {
      'submit_button_url': string,
      'thumbnail_url': string
    }
  },
  facebook: {
    enable: boolean,
    pageId: string,
    applicationId: string
  },
  GDPR: {
    enable: boolean
  },
  PowerReviews: {
    enable: boolean,
    'api_key': string,
    'merchant_group_id': string,
    'merchant_id': string
  },
  formatQueryParameter: {
    standardlinks: boolean,
    noself: boolean,
    nodatalinks: boolean
  },
  creditCardTokenization: {
    enable: boolean,
    lambdaURI: string
  }
}

interface IConfig {
  config: IEpConfig | any,
  intl: any
}

let config: IConfig = {
  config: {},
  intl: { get: str => str },
};

export function init(_config: IConfig) {
  return new Promise((resolve) => {
    config = Object.freeze(_config);
    resolve({ version: packageJson.version });
  });
}

export function getConfig(): IConfig {
  return config;
}
