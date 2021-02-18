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

import React, { Component } from 'react';
import intl from 'react-intl-universal';
import * as UserPrefs from '../utils/UserPrefs';
// import currencyLogoCad from '../../../images/header-icons/ca.svg';
// import currencyLogoEur from '../../../images/header-icons/eu.svg';
// import headerLogo from '../../../images/site-images/Company-Logo-v1.png';
import Config from '../../../ep.config.json';

import './appheaderlocale.main.scss';


interface AppHeaderLocaleMainProps {
  /** is mobile view  */
  isMobileView?: boolean,
  /** handle currency change */
  onCurrencyChange?: (...args: any[]) => any,
  /** handle location change */
  onLocaleChange?: (...args: any[]) => any,
}

interface AppHeaderLocaleMainState {
  selectedLocaleValue: any,
  selectedCurrencyValue: any,
}

class AppHeaderLocaleMain extends Component<AppHeaderLocaleMainProps, AppHeaderLocaleMainState> {
  static defaultProps = {
    isMobileView: false,
    onCurrencyChange: () => {},
    onLocaleChange: () => {},
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedLocaleValue: UserPrefs.getSelectedLocaleValue(),
      selectedCurrencyValue: UserPrefs.getSelectedCurrencyValue(),
    };
  }

  handleLocaleClick(newLocaleValue) {
    const { onLocaleChange } = this.props;
    this.setState({
      selectedLocaleValue: newLocaleValue,
    });
    UserPrefs.setSelectedLocaleValue(newLocaleValue);
    onLocaleChange();
  }

  handleCurrencyClick(newCurrencyValue) {
    const { onCurrencyChange } = this.props;
    this.setState({
      selectedCurrencyValue: newCurrencyValue,
    });
    UserPrefs.setSelectedCurrencyValue(newCurrencyValue);
    onCurrencyChange();
  }

  render() {
    const { selectedLocaleValue, selectedCurrencyValue } = this.state;
    const selectedLocale = Config.supportedLocales.filter(l => l.value === selectedLocaleValue)[0];
    const title = `${selectedCurrencyValue}/${selectedLocale.name}`;
    const { isMobileView } = this.props;
    // const selectedCurrencyLogo = selectedCurrencyValue === 'CAD' ? currencyLogoCad : currencyLogoEur;
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
