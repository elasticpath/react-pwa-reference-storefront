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
function ErrorDisplayBoundary({ children }) {
  const [error, setError]:any = useState([]);
  const ctx:any = useMemo(() => ({ error, setError }), [error]);
  // eslint-disable-next-line consistent-return
  setE = (e) => {
    if (e && error && error.find(el => el.debugMessages === e.debugMessages)) {
      return [];
    }
    return setError([...error, e]);
  };
  removeE = (index) => {
    const arrayMsg = [...error];
    arrayMsg.splice(index, 1);
    return setError(arrayMsg);
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

export {
  ErrorContext, ErrorDisplayBoundary, ErrorInlet, ErrorRemove,
};
