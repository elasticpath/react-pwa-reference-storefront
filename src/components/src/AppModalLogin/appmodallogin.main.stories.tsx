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
import { object, text, boolean } from "@storybook/addon-knobs/react";
import { textToFunc } from "../../../../storybook/utils/storybookUtils"
import AppModalLoginMain from './appmodallogin.main';

// Option defaults.

const appModalLoginLinks = {
  registration: '',
};

storiesOf('Components|AppModalLoginMain', module)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: Readme,
    },
  })
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('AppModalLoginMain', () => {
    let handleModalCloseFuncText = text('handleModalClose','() => {alert("handleModalClose invoked")}');
    let onLoginFuncText = text('onLogin', '() => {alert("onLogin invoked")}');
    let onResetPasswordFuncText = text('onResetPassword', '() => {alert("onResetPassword invoked")}');
    
    return (
    <AppModalLoginMain
      handleModalClose={() => {textToFunc(handleModalCloseFuncText)}} 
      openModal={boolean('openModal', true)}
      onLogin={() => {textToFunc(onLoginFuncText)}}
      onResetPassword={() => {textToFunc(onResetPasswordFuncText)}}
      locationSearchData={text('locationSearchData', '')}
      appModalLoginLinks={object('appModalLoginLinks', appModalLoginLinks)} 
      disableLogin={boolean('disableLogin', true)}
      showForgotPasswordLink={boolean('showForgotPasswordLink', false)} />)
});
