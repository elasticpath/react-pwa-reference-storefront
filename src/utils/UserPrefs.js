
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
