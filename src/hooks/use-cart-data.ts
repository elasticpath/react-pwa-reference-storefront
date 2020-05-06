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

import { useState, useEffect } from 'react';
import { cortexFetch } from '../utils/Cortex';
import { login } from '../utils/AuthService';
import Config from '../ep.config.json';


const zoomArray = [
  'defaultcart',
  'defaultcart:additemstocartform',
  'carts',
  'carts:element',
  'carts:element:additemstocartform',
];

export interface CartData {
  totalQuantity: number;
  addItemsToCartAction: string;
}

function parseCartData(defaultCart: any): CartData {
  const totalQuantity = defaultCart['total-quantity'];

  return {
    totalQuantity,
    addItemsToCartAction: '',
  };
}

export function useCartData() {
  const [isLoading, setIsLoading] = useState(false);
  const [cartError, setError] = useState(undefined);
  // const [totalQuantity, setTotalQuantity] = useState(0);
  const [cartData, setCartData] = useState<CartData>(undefined);
  const [multiCartData, setMultiCartData] = useState(undefined);

  useEffect(() => {
    const fetchCartData = () => {
      login().then(() => {
        cortexFetch(`/?zoom=${zoomArray.sort().join()}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
          .then(res => res.json())
          .then((res) => {
            setIsLoading(false);

            if (res) {
              if (res._defaultcart && res._defaultcart.length > 0) {
                setCartData({
                  totalQuantity: res._defaultcart?.[0]?.['total-quantity'] ?? 0,
                  addItemsToCartAction: res._defaultcart?.[0]?.links?.filter?.(l => l.rel === 'additemstocartaction')?.[0]?.href,
                });
              }

              if (res._carts && res._carts.length > 0) {
                setMultiCartData(res._carts[0]);
              }
            } else {
              setError('Error during fetching: no response');
            }
          })
          .catch((err) => {
            setError(`Error during fetching: ${err.message}`);
          });
      });
    };

    fetchCartData();
  }, []);

  return {
    isLoading,
    cartError,
    cartData,
    multiCartData,
  };
}
