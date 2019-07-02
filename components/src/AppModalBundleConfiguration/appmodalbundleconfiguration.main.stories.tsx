import React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import Item from '../CommonMockHttpResponses/cart_data_response.json';

import AppModalBundleConfigurationMain from './appmodalbundleconfiguration.main';

const isOpenModal = true;

function handleModalClose(){}

storiesOf('AppModalBundleConfigurationMain', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('AppModalBundleConfigurationMain', () => {
    return (
        <AppModalBundleConfigurationMain handleModalClose={handleModalClose} bundleConfigurationItems={Item._defaultcart[0]._lineitems[0]._element[0]} openModal={isOpenModal} />
  );
  });
