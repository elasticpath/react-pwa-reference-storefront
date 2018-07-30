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

const Config = require('Config');

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
