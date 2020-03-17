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
import React, { useState } from 'react';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import { login } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';
import { useRequisitionListCountDispatch } from '../requisition-list-count-context';

import './productRequisitionListButton.less';

let Config: IEpConfig | any = {};
const intl = { get: str => str };

const ProductRequisitionListButton = (props: { productData: any, itemQuantity: number, requisitionListData: any }) => {
  Config = getConfig().config;
  // intl = Config.intl;
  const { productData, itemQuantity, requisitionListData } = props;

  const [loadingState, setLoadingState] = useState(false);

  let availability = (productData._addtocartform && productData._addtocartform[0].links.length > 0);
  if (productData._availability[0].state === 'AVAILABLE_FOR_BACK_ORDER') {
    availability = true;
  }

  const dispatch = useRequisitionListCountDispatch();
  const onCountChange = (name, count) => {
    const data = {
      type: 'COUNT_SHOW',
      payload: {
        count,
        name,
      },
    };
    dispatch(data);
    setTimeout(() => {
      dispatch({ type: 'COUNT_HIDE' });
    }, 3200);
  };

  const addToRequisitionList = (list) => {
    const listUrl = list._additemstoitemlistform[0].self.uri;
    const { name } = list;

    setLoadingState(true);

    login().then(() => {
      const body: { [key: string]: any } = {};
      body.items = { code: productData._code[0].code, quantity: itemQuantity };
      cortexFetch(listUrl,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
          body: JSON.stringify(body),
        })
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setLoadingState(false);
            onCountChange(name, itemQuantity);
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
          setLoadingState(false);
        });
    });
  };

  return (
    <div className="form-content form-content-submit dropdown cart-selection-dropdown">
      <button
        className="ep-btn btn-itemdetail-addtowishlist dropdown-toggle"
        data-toggle="dropdown"
        disabled={!availability || !productData._addtowishlistform}
        type="submit"
      >
        {loadingState ? (
          <span className="miniLoader" />
        ) : (
          <span>
            {intl.get('add-to-requisition-list')}
          </span>
        )}
      </button>
      <div className="dropdown-menu cart-selection-menu cart-selection-list">
        <ul className="cart-selection-list">
          {requisitionListData.map(list => (
            // eslint-disable-next-line
            <li className="dropdown-item cart-selection-menu-item" key={list.name ? list.name : intl.get('default')}
              onClick={() => addToRequisitionList(list)}
            >
              {list.name ? list.name : intl.get('default')}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductRequisitionListButton;
