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
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as UserPrefs from '../utils/UserPrefs';

const Config = require('Config');

class AppHeaderLocaleMain extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedLocaleValue: UserPrefs.getSelectedLocaleValue(),
      selectedCurrencyValue: UserPrefs.getSelectedCurrencyValue(),
    };

    this.dropdownRef = React.createRef();
  }

  handleLocaleClick(newLocaleValue) {
    this.setState({
      selectedLocaleValue: newLocaleValue,
    });
    this.dropdownRef.current.hide();
    UserPrefs.setSelectedLocaleValue(newLocaleValue);
    window.location.reload();
  }

  handleCurrencyClick(newCurrencyValue) {
    this.setState({
      selectedCurrencyValue: newCurrencyValue,
    });
    this.dropdownRef.current.hide();
    UserPrefs.setSelectedCurrencyValue(newCurrencyValue);
    window.location.reload();
  }

  render() {
    const { selectedLocaleValue, selectedCurrencyValue } = this.state;
    const selectedLocale = Config.supportedLocales.filter(l => l.value === selectedLocaleValue)[0];
    const title = `${selectedLocale.name.substring(0, 2)}/${selectedCurrencyValue}`;

    return (
      <div className="main-locale-container">
        <Dropdown ref={this.dropdownRef}>
          <DropdownTrigger>
            <div className="trigger-content">
              {title}
            </div>
          </DropdownTrigger>
          <DropdownContent>
            <div className="locale-currency-container">
              <div className="locale-pane">
                <div className="title">
                  Language
                </div>
                <div className="options">
                  {Config.supportedLocales.map(locale => (
                    <button
                      type="button"
                      key={locale.value}
                      className={`locale-item ${locale.value === selectedLocaleValue ? 'selected' : 'not-selected'}`}
                      onClick={() => locale.value !== selectedLocaleValue && this.handleLocaleClick(locale.value)}
                    >
                      {locale.name}
                      {locale.value === selectedLocaleValue && (
                        <div className="icon">
                          <FontAwesomeIcon icon="check" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="currency-pane">
                <div className="title">
                  Currency
                </div>
                <div className="options">
                  {Config.supportedCurrencies.map(currency => (
                    <button
                      type="button"
                      key={currency.value}
                      className={`locale-item ${currency.value === selectedCurrencyValue ? 'selected' : 'not-selected'}`}
                      onClick={() => currency.value !== selectedCurrencyValue && this.handleCurrencyClick(currency.value)}
                    >
                      {currency.name}
                      {currency.value === selectedCurrencyValue && (
                        <div className="icon">
                          <FontAwesomeIcon icon="check" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </DropdownContent>
        </Dropdown>
      </div>
    );
  }
}

export default AppHeaderLocaleMain;
