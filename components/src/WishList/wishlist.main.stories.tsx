import React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import wishListData from './MockHttpResponses/wish_list_response.json';

import WishListMain from './wishlist.main';

const handler = () => {};
const itemDetailLink = '/itemdetail';

storiesOf('WishListMain', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/wishlists']}>{story()}</MemoryRouter>
  ))
  .add('WishListMain with data', () =>
    <WishListMain
      empty={false}
      wishListData={wishListData}
      handleQuantityChange={() => { handler() }}
      onItemConfiguratorAddToCart={handler}
      onItemMoveToCart={handler}
      onItemRemove={handler}
      itemDetailLink={itemDetailLink}
    />
  )
  .add('WishListMain empty', () =>
    <WishListMain
      empty={true}
      wishListData={wishListData}
      handleQuantityChange={() => { handler() }}
    />
  );
