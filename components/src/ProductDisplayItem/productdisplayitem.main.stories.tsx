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

function dummyOnChangeProductFeature(path) {
  // TODO: May want to include: https://github.com/gvaldambrini/storybook-router into project to show multi sku option transitions.
  alert(`container passed in callback invoked with selected options sku: ${path}`);
  window.location.reload();
}

storiesOf('ProductDisplayItemMain', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/itemdetail']}>{story()}</MemoryRouter>
  ))
  .add('ProductDisplayItemMain Plain', () =>  {
    mockProductDisplayItemMainPlain();
    return <ProductDisplayItemMain productId='83992'/>
  })
  .add('ProductDisplayItemMain Color/size', () =>  {
    mockProductDisplayItemMainColorAndSize();
    return <ProductDisplayItemMain productId='VESTRI_WORDMARK_FITTED_HAT_RD' onChangeProductFeature={dummyOnChangeProductFeature} />
  })
  .add('ProductDisplayItemMain Input', () =>  {
    mockProductDisplayItemMainInput();
    return <ProductDisplayItemMain productId='250HR_PMKIT' />
  });
