import React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import bundleLineItem from './MockHttpResponses/GET/bundleLineItem_response.json';

import AppModalBundleConfigurationMain from './appmodalbundleconfiguration.main';

import { mockAppModalBundleConfigurationMain } from './appModalBundleConfiguration.main.api.mock';

const isOpenModal = true;

function handleModalClose(){}

storiesOf('AppModalBundleConfigurationMain', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('AppModalBundleConfigurationMain', () => {
    mockAppModalBundleConfigurationMain();
    return (
        <AppModalBundleConfigurationMain handleModalClose={handleModalClose} bundleConfigurationItems={bundleLineItem} openModal={isOpenModal} />
  );
  });
