/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 */

import React from 'react';
import * as UserPrefs from '../utils/UserPrefs';

const Config = require('Config');

class AppHeaderLocaleMain extends React.Component {
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

    return (
      <li className="main-locale-container">
        <div className="locale-dropdown">
          <button id="locale-dropdown-trigger" type="button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {title}
          </button>
          <div className="dropdown-menu dropdown-menu-right dropdown-margin-right">
            <h6 className="dropdown-header">
              Language
            </h6>
            {Config.supportedLocales.map(locale => (
              <button
                type="button"
                key={locale.value}
                id={`locale-${locale.value}`}
                className={`dropdown-item ${locale.value === selectedLocaleValue ? 'selected disabled' : 'not-selected'}`}
                onClick={() => locale.value !== selectedLocaleValue && this.handleLocaleClick(locale.value)}
              >
                {locale.name}
              </button>
            ))}

            <div className="dropdown-divider" />

            <div className="dropdown-header">
              Currency
            </div>
            {Config.supportedCurrencies.map(currency => (
              <button
                type="button"
                key={currency.value}
                id={`currency-${currency.value}`}
                className={`dropdown-item locale-item ${currency.value === selectedCurrencyValue ? 'selected disabled' : 'not-selected'}`}
                onClick={() => currency.value !== selectedCurrencyValue && this.handleCurrencyClick(currency.value)}
              >
                {currency.name}
              </button>
            ))}
          </div>
        </div>
      </li>
    );
  }
}

export default AppHeaderLocaleMain;
