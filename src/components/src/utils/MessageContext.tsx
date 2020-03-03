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
import React, {
  useState, useMemo,
} from 'react';

const ErrorContext:any = React.createContext('');
let setE:any = () => {};
let removeE:any = () => {};
let removeAllE:any = () => {};
function ErrorDisplayBoundary({ children }) {
  const [error, setError]:any = useState([]);
  const ctx:any = useMemo(() => ({ error, setError }), [error]);

  setE = (e) => {
    const arrayExistMessage = error.reduce((acum, el) => acum.concat(el.debugMessages.split(' \n ')), []);
    const arrayNewMessage = e.debugMessages && e.debugMessages.split(' \n ');
    if (e && error && error.find(el => el.debugMessages === e.debugMessages)) {
      return [];
    }
    if (arrayExistMessage && arrayNewMessage) {
      const a = arrayNewMessage.filter(el => arrayExistMessage.indexOf(el) === -1);
      if (!a.length) {
        return [];
      }
      return setError([...error, { ...e, debugMessages: a.join(' \n ') }]);
    }
    return setError([...error, e]);
  };
  removeE = (index) => {
    const arrayMsg = [...error];
    arrayMsg.splice(index, 1);
    return setError(arrayMsg);
  };
  removeAllE = () => {
    const arrayMsg = [...error];
    if (arrayMsg.length) {
      setError([]);
    }
  };
  return (<ErrorContext.Provider value={ctx}>{children}</ErrorContext.Provider>);
}

function ErrorInlet(error) {
  setE(error);
  return null;
}

function ErrorRemove(index) {
  removeE(index);
  return null;
}

function ErrorRemoveAll() {
  removeAllE();
  return null;
}

export {
  ErrorContext, ErrorDisplayBoundary, ErrorInlet, ErrorRemove, ErrorRemoveAll,
};
