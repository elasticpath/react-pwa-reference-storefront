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

import { login } from './AuthService';
import { cortexFetch } from './Cortex';

const Config = require('Config');

// Array of zoom parameters to pass to Cortex
const zoomArray = [
  // zooms for shipping options
  'defaultcart:order:deliveries:element:shippingoptioninfo:shippingoption',
  'defaultcart:order:deliveries:element:shippingoptioninfo:selector:choice',
  'defaultcart:order:deliveries:element:shippingoptioninfo:selector:choice:description',
  // zoom for purchaseform
  'defaultcart:order:purchaseform',
];

const supportedPaymentMethods = [
  {
    supportedMethods: 'basic-card',
  },
];
const paymentDetails = {};
const displayItemsArray = [];
let globalShippingOptions = [
  {
    id: 'economy',
    label: 'Economy Shipping (5-7 Days)',
    amount: {
      currency: 'USD',
      value: '0',
    },
  }, {
    id: 'express',
    label: 'Express Shipping (2-3 Days)',
    amount: {
      currency: 'USD',
      value: '5',
    },
  }, {
    id: 'next-day',
    label: 'Next Day Delivery',
    amount: {
      currency: 'USD',
      value: '12',
    },
  },
];
let options = {
  requestShipping: true,
  requestPayerEmail: true,
  requestPayerName: true,
  requestPayerPhone: true,
};
let paymentRequest;
let addressForm;

export function fetchAddressForm() {
  login().then(() => {
    cortexFetch('/?zoom=defaultprofile:addresses:addressform', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
    })
      .then(res => res.json())
      .then((res) => {
        const addressFormLink = res._defaultprofile[0]._addresses[0]._addressform[0].links.find(link => link.rel === 'createaddressaction').uri;
        addressForm = addressFormLink;
      });
  });
}

export function submitAddress(firstName, lastName, address, extendedAddress, city, country, subCountry, postalCode) {
  login().then(() => {
    cortexFetch('/?zoom=defaultprofile:addresses:addressform', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
    })
      .then(res => res.json())
      .then((res) => {
        const addressFormLink = res._defaultprofile[0]._addresses[0]._addressform[0].links.find(link => link.rel === 'createaddressaction').uri;
        addressForm = addressFormLink;

        const link = addressForm;
        const methodType = 'post';
        cortexFetch(link, {
          method: methodType,
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
          body: JSON.stringify({
            name: {
              'given-name': firstName,
              'family-name': lastName,
            },
            address: {
              'street-address': address,
              'extended-address': extendedAddress,
              locality: city,
              'country-name': country,
              region: subCountry,
              'postal-code': postalCode,
            },
          }),
        }).then((res2) => {
          if (res2.status === 400) {
            // eslint-disable-next-line no-console
            console.log('fail');
          } else if (res2.status === 201 || res2.status === 200 || res2.status === 204) {
            // eslint-disable-next-line no-console
            console.log('success');
          }
        }).catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
      });
  });
}

export function fetchOrderData() {
  return new Promise(((resolve, reject) => {
    login().then(() => {
      cortexFetch(`/?zoom=${zoomArray.sort().join()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
        .then(res => res.json())
        .then((res) => {
          resolve(res._defaultcart[0]);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
          reject(error);
        });
    });
  }));
}

export function setPaymentDisplayItem(paymentDisplayItemLabel, paymentDisplayItemAmountCurrency = 'USD', paymentDisplayItemAmountValue) {
  displayItemsArray.push({
    label: paymentDisplayItemLabel,
    amount: {
      currency: paymentDisplayItemAmountCurrency,
      value: paymentDisplayItemAmountValue,
    },
  });
}

export function setPaymentTotalDetails(cartDataLineItems, paymentAmountCurrency = 'USD', paymentAmountValue = 0) {
  paymentDetails.displayItems = displayItemsArray;
  paymentDetails.total = {
    label: 'Total',
    amount: {
      currency: paymentAmountCurrency,
      value: paymentAmountValue,
    },
  };
  // eslint-disable-next-line no-console
  console.log(paymentDetails);
}

export function submitEmail(email) {
  return new Promise(((resolve, reject) => {
    login().then(() => {
      let emailForm;
      cortexFetch('/?zoom=defaultprofile:emails:emailform', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(res => res.json())
        .then((res) => {
          emailForm = res._defaultprofile[0]._emails[0]._emailform[0].links.find(link => link.rel === 'createemailaction').uri;
        })
        .then(() => {
          cortexFetch(emailForm, {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
            },
            body: JSON.stringify({ email }),
          })
            .then((res) => {
              // eslint-disable-next-line no-console
              console.log(res);
              resolve(res);
            }).catch((error) => {
              // eslint-disable-next-line no-console
              console.error(error.message);
              reject(error);
            });
        });
    });
  }));
}

export function submitPayment(methodName, details, payerName) {
  return new Promise(((resolve, reject) => {
    login().then(() => {
      cortexFetch('/?zoom=defaultcart:order:paymentmethodinfo:paymenttokenform,defaultprofile:paymentmethods:paymenttokenform', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(res => res.json())
        .then((res) => {
          const orderPaymentFormLink = res._defaultcart[0]._order[0]._paymentmethodinfo[0]._paymenttokenform[0].links.find(
            link => link.rel === 'createpaymenttokenfororderaction',
          );
          const link = orderPaymentFormLink.uri;
          // set link based on savetoprofile
          login().then(() => {
            cortexFetch(link, {
              method: 'post',
              headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
              },
              body: JSON.stringify({
                'display-name': `${payerName}'s ${methodName} ending in: ****${details.cardNumber.substring(details.cardNumber.length - 4)}`,
                token: Math.random().toString(36).substr(2, 9),
                /* token is being randomly generated here to be passed to the demo payment gateway
                ** in a true implementation this token should be received from the actual payment gateway
                ** when doing so, make sure you're compliant with PCI DSS
                */
              }),
            });
          }).then((res2) => {
            // eslint-disable-next-line no-console
            console.log(res2);
            resolve(res2);
          }).catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error.message);
            reject(error);
          });
        });
    });
  }));
}

export function completeOrder(paymentResponse) {
  submitEmail(paymentResponse.payerEmail).then(() => {
    submitPayment(paymentResponse.methodName, paymentResponse.details, paymentResponse.payerName).then(() => {
      setTimeout(() => {
        const purchaseZoomArray = [
          'paymentmeans:element',
          'shipments:element:destination',
          'shipments:element:shippingoption',
          'billingaddress',
          'discount',
          'appliedpromotions:element',
          'lineitems:element',
          'lineitems:element:options:element',
          'lineitems:element:options:element:value',
        ];
        fetchOrderData().then((orderData) => {
          const purchaseform = orderData._order[0]._purchaseform[0].links.find(link => link.rel === 'submitorderaction').uri;
          login().then(() => {
            cortexFetch(`${purchaseform}?followlocation&zoom=${purchaseZoomArray.sort().join()}`, {
              method: 'post',
              headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
              },
            })
              .then(res => res.json())
              .then((res) => {
                // eslint-disable-next-line no-console
                console.log(res);
              })
              .catch((error) => {
                // eslint-disable-next-line no-console
                console.error(error.message);
              });
          });
        });
      }, 1000);
    });
  });
}

export function setPaymentOptions() {
  options = {};
}

export function setGlobalShippingOptions() {
  return new Promise(((resolve) => {
    fetchOrderData().then((orderData) => {
      // eslint-disable-next-line no-console
      console.log(orderData);
      globalShippingOptions = [];
      orderData._order[0]._deliveries[0]._element[0]._shippingoptioninfo[0]._shippingoption.forEach((option) => {
        globalShippingOptions.push({
          id: option.name,
          label: option['display-name'],
          amount: {
            currency: option.cost[0].currency,
            value: option.cost[0].amount,
          },
        });
        resolve(globalShippingOptions);
      });
    }).then(() => {
      // eslint-disable-next-line no-console
      console.log('test');
    });
  }));
}

export function handleChange(link) {
  login().then(() => {
    cortexFetch(link, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
    }).then(() => {
      this.fetchOrderData();
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error.message);
    });
  });
}


export function newPaymentRequest() {
  paymentRequest = new PaymentRequest(
    supportedPaymentMethods,
    paymentDetails,
    options,
  );

  paymentRequest.addEventListener('shippingaddresschange', (event) => {
    // eslint-disable-next-line no-console
    console.log(event);
    submitAddress(event.currentTarget.shippingAddress.recipient.split(' ')[0], event.currentTarget.shippingAddress.recipient.split(' ')[1], event.currentTarget.shippingAddress.addressLine[0], '', event.currentTarget.shippingAddress.city, event.currentTarget.shippingAddress.country, event.currentTarget.shippingAddress.region, event.currentTarget.shippingAddress.postalCode);
    const updatedShippingOptions = setGlobalShippingOptions().then((shippingOptions) => {
      paymentDetails.shippingOptions = shippingOptions;
      return paymentDetails;
    });
    event.updateWith(updatedShippingOptions);
  });

  paymentRequest.addEventListener('shippingoptionchange', (event) => {
    // Step 1: Get the payment request object.
    const prInstance = event.target;

    // Step 2: Get the ID of the selected shipping option.
    const selectedId = prInstance.shippingOption;

    // Step 3: Mark selected option
    globalShippingOptions.forEach((option) => {
      option.selected = option.id === selectedId; // eslint-disable-line no-param-reassign
    });

    // TODO: Update total and display items, including pending states.

    event.updateWith({
      total: {
        label: 'Total',
        amount: {
          currency: paymentDetails.total.amount.currency,
          value: paymentDetails.total.amount.value,
        },
      },
      shippingOptions: globalShippingOptions,
    });
  });
}

export function isPaymentRequestAvailable() {
  return window.PaymentRequest;
}

export function showPaymentRequest() {
  paymentRequest.show()
    .then((paymentResponse) => {
      completeOrder(paymentResponse);
      // eslint-disable-next-line no-console
      console.log(paymentResponse);
      // The user filled in the required fields and completed the flow
      // Get the details from `paymentResponse` and complete the transaction.
      return paymentResponse.complete();
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error.message);
      // The API threw an error or the user closed the UI
    });
}
