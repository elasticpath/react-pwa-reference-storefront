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
import { object, text, boolean } from '@storybook/addon-knobs/react';
import { textToFunc } from '../../../../storybook/utils/storybookUtils';
import AppHeaderMain from './appheader.main';
import mockProductDisplayItemMainMultiCart from './appheader.main.api.mocks';

const appHeaderLinks = {
  mainPage: '',
  myCart: '',
};
const appHeaderLoginLinks = {
  profile: '',
  wishlists: '',
};
const appHeaderNavigationLinks = {
  categories: '',
  subCategories: '',
};
const appHeaderTopLinks = {
  shippingreturns: '',
  aboutus: '',
  contactus: '',
};
const appModalLoginLinks = {
  registration: '',
};

storiesOf('Components|AppHeaderMain', module)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: Readme,
    },
  })
  .add('AppHeaderMain', () => {
    mockProductDisplayItemMainMultiCart();

    const onSearchPageFuncText = text('onSearchPage', '() => {alert("onSearchPage invoked")}');
    const redirectToMainPageFuncText = text('redirectToMainPage', '() => {alert("redirectToMainPage invoked")}');
    const handleResetPasswordFuncText = text('handleResetPassword', '() => {alert("handleResetPassword invoked")}');
    const onCurrencyChangeFuncText = text('onCurrencyChange', '() => {alert("onCurrencyChange invoked")}'); 
    const onLocaleChangeFuncText = text('onLocaleChange', '() => {alert("onLocaleChange invoked")}');
    const onContinueCartFuncText = text('onContinueCart','() => {alert("onContinueCart invoked")}');
    const onGoBackFuncText = text('onGoBack', '() => {alert("onGoBack invoked")}');

    return (
      <MemoryRouter initialEntries={['/']}>
        <AppHeaderMain
          onSearchPage={() => textToFunc(onSearchPageFuncText)}
          redirectToMainPage={() => textToFunc(redirectToMainPageFuncText)}
          handleResetPassword={() => textToFunc(handleResetPasswordFuncText)}
          onCurrencyChange={() => textToFunc(onCurrencyChangeFuncText)}
          onLocaleChange={() => textToFunc(onLocaleChangeFuncText)}
          onContinueCart={() => textToFunc(onContinueCartFuncText)}
          onGoBack={() => textToFunc(onGoBackFuncText)}
          checkedLocation={boolean('checkedLocation', false)}
          isInStandaloneMode={boolean('isInStandaloneMode', false)}
          locationSearchData={text('locationSearchData', '')}
          appHeaderLinks={object('appHeaderLinks', appHeaderLinks)}
          appHeaderLoginLinks={object('appHeaderLoonCurrencyChangeFuncTextginLinks', appHeaderLoginLinks)}
          appHeaderNavigationLinks={object('appHeaderNavigationLinks', appHeaderNavigationLinks)}
          appHeaderTopLinks={object('appHeaderTopLinks', appHeaderTopLinks)}
          appModalLoginLinks={object('appModalLoginLinks', appModalLoginLinks)}
        />
      </MemoryRouter>
    );
  });
