
import * as UserPrefs from './UserPrefs';

function cortextFetch(input, init) {
  const requestInit = init;

  if (requestInit && requestInit.headers) {
    requestInit.headers['x-ep-user-traits'] = `LOCALE=${UserPrefs.getSelectedLocaleValue()}, CURRENCY=${UserPrefs.getSelectedCurrencyValue()}`;
  }

  return fetch(input, requestInit);
}

export default cortextFetch;
