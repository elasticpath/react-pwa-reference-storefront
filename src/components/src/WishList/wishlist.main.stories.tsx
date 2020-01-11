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
import Readme from './README.md';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import wishListData from './MockHttpResponses/wish_list_response.json';
import { text, object, boolean } from "@storybook/addon-knobs/react";
import { textToFunc } from '../../../../storybook/utils/storybookUtils';
import WishListMain from './wishlist.main';

const itemDetailLink = '/itemdetail';

let handleQuantityChangeFuncText;
let onItemConfiguratorAddToCartFuncText
let onItemMoveToCartFuncText;
let onItemRemove;

storiesOf('Components|WishListMain', module)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: Readme,
    },
  })
  .addDecorator(story => {
    handleQuantityChangeFuncText = text('handleQuantityChange', '() => {alert("handleQuantityChange invoked")}');
    onItemConfiguratorAddToCartFuncText = text('onItemConfiguratorAddToCart', '() => {alert("onItemConfiguratorAddToCart invoked")}');
    onItemMoveToCartFuncText = text('onItemMoveToCart', '() => {alert("onItemMoveToCart invoked")}');
    onItemRemove = text('onItemRemove', '() => {alert("onItemRemove invoked")}');
    return (<MemoryRouter initialEntries={['/wishlists']}>{story()}</MemoryRouter>)
  })
  .add('WishListMain with data', () => <WishListMain
    empty={boolean('empty', false)}
    wishListData={object('wishListData',wishListData)}
    handleQuantityChange={() => textToFunc(handleQuantityChangeFuncText)}
    onItemConfiguratorAddToCart={() => textToFunc(onItemConfiguratorAddToCartFuncText)}
    onItemMoveToCart={() => textToFunc(onItemMoveToCartFuncText)}
    onItemRemove={() => textToFunc(onItemRemove)}
    itemDetailLink={text('itemDetailLink', itemDetailLink)}
  />)
  .add('WishListMain empty', () => <WishListMain
    empty={boolean('empty', true)}
    wishListData={object('wishListData',wishListData)}
    handleQuantityChange={() => textToFunc(handleQuantityChangeFuncText)}
    onItemConfiguratorAddToCart={() => textToFunc(onItemConfiguratorAddToCartFuncText)}
    onItemMoveToCart={() => textToFunc(onItemMoveToCartFuncText)}
    onItemRemove={() => textToFunc(onItemRemove)}
    itemDetailLink={text('itemDetailLink', itemDetailLink)}
  />);
