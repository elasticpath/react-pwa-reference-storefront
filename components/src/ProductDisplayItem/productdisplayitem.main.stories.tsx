import React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';
// Import custom required styles
import '../style/reset.less';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.less';
import { 
  mockProductDisplayItemMainPlain, 
  mockProductDisplayItemMainColorAndSize,
  mockProductDisplayItemMainInput
} from './productdisplayitem.main.api.mocks';

// Import custom required scripts
import 'bootstrap/dist/js/bootstrap.bundle.min';

import ProductDisplayItemMain from './productdisplayitem.main';

storiesOf('ProductDisplayItemMain', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/itemdetail']}>{story()}</MemoryRouter>
  ))
  .add('ProductDisplayItemMain Plain', () =>  {
    mockProductDisplayItemMainPlain();
    return <ProductDisplayItemMain productId='83992' />
  })
  .add('ProductDisplayItemMain Color/size', () =>  {
    mockProductDisplayItemMainColorAndSize();
    return <ProductDisplayItemMain productId='VESTRI_WORDMARK_FITTED_HAT_RD' />
  })
  .add('ProductDisplayItemMain Input', () =>  {
    mockProductDisplayItemMainInput();
    return <ProductDisplayItemMain productId='250HR_PMKIT' />
  });
