/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
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
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import * as UserPrefs from '../utils/UserPrefs';

import './appheaderlocale.main.less';

const Config = require('Config');

class AppHeaderLocaleMain extends React.Component {
  static propTypes = {
    isMobileView: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedLocaleValue: UserPrefs.getSelectedLocaleValue(),
      selectedCurrencyValue: UserPrefs.getSelectedCurrencyValue(),
    };
  }

  handleLocaleClick(newLocaleValue) {
    this.setState({
      selectedLocaleValue: newLocaleValue,
    });
    UserPrefs.setSelectedLocaleValue(newLocaleValue);
    window.location.reload();
  }

  handleCurrencyClick(newCurrencyValue) {
    this.setState({
      selectedCurrencyValue: newCurrencyValue,
    });
    UserPrefs.setSelectedCurrencyValue(newCurrencyValue);
    window.location.reload();
  }

  render() {
    const { selectedLocaleValue, selectedCurrencyValue } = this.state;
    const selectedLocale = Config.supportedLocales.filter(l => l.value === selectedLocaleValue)[0];
    const title = `${selectedLocale.name.substring(0, 2)}/${selectedCurrencyValue}`;
    const { isMobileView } = this.props;

    return (
      <div className={`main-locale-container ${isMobileView ? 'mobile-view' : ''}`}>
        <button id={`${isMobileView ? 'mobile_' : ''}locale-dropdown-trigger`} type="button" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {title}
        </button>
        <div className="dropdown-menu dropdown-menu-right dropdown-margin-right">
          <div className="dropdown-header">
            {intl.get('language')}
          </div>
          {Config.supportedLocales.map(locale => (
            <button
              type="button"
              key={locale.value}
              id={`${isMobileView ? 'mobile_' : ''}locale-${locale.value}`}
              className={`dropdown-item ${locale.value === selectedLocaleValue ? 'selected disabled' : 'not-selected'}`}
              onClick={() => locale.value !== selectedLocaleValue && this.handleLocaleClick(locale.value)}
            >
              {locale.name}
            </button>
          ))}

          <div className="dropdown-divider" />

          <div className="dropdown-header">
            {intl.get('currency')}
          </div>
          {Config.supportedCurrencies.map(currency => (
            <button
              type="button"
              key={currency.value}
              id={`${isMobileView ? 'mobile_' : ''}currency-${currency.value}`}
              className={`dropdown-item locale-item ${currency.value === selectedCurrencyValue ? 'selected disabled' : 'not-selected'}`}
              onClick={() => currency.value !== selectedCurrencyValue && this.handleCurrencyClick(currency.value)}
            >
              {currency.name}
            </button>
          ))}
        </div>
      </div>
    );
  }
}

export default AppHeaderLocaleMain;
