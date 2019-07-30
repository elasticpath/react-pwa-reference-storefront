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

import * as Config from '../ep.config.json';

export function getSelectedLocaleValue() {
  const storedLocaleValue = localStorage.getItem(`${Config.cortexApi.scope}_locale`);

  return (Config.supportedLocales.filter(l => l.value === storedLocaleValue).length > 0)
    ? storedLocaleValue
    : Config.defaultLocaleValue;
}

export function setSelectedLocaleValue(newLocale) {
  if (Config.supportedLocales.filter(l => l.value === newLocale).length === 0) {
    throw new Error(`Locale ${newLocale} is not in the list of supported locales.`);
  }

  localStorage.setItem(`${Config.cortexApi.scope}_locale`, newLocale);
}

export function getSelectedCurrencyValue() {
  const storedCurrencyValue = localStorage.getItem(`${Config.cortexApi.scope}_currency`);

  return (Config.supportedCurrencies.filter(c => c.value === storedCurrencyValue).length > 0)
    ? storedCurrencyValue
    : Config.defaultCurrencyValue;
}

export function setSelectedCurrencyValue(newCurrency) {
  if (Config.supportedCurrencies.filter(c => c.value === newCurrency).length === 0) {
    throw new Error(`Currency ${newCurrency} is not in the list of supported currencies.`);
  }

  localStorage.setItem(`${Config.cortexApi.scope}_currency`, newCurrency);
}
