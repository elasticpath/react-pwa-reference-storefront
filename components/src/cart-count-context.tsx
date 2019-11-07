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
import React from 'react';

interface State { count: number, name: string }
interface Action {
  type: string,
  payload?: State | undefined
}

const CountStateContext = React.createContext<State | undefined>({ count: 0, name: '' });
const CountDispatchContext = React.createContext<(action: Action) => void | undefined>(undefined);
function countReducer(state, action) {
  switch (action.type) {
    case 'COUNT_SHOW': {
      const { count, name } = action.payload;
      return { count, name };
    }
    case 'COUNT_HIDE': {
      return { count: 0, name: '' };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
function CountProvider({ children }) {
  const [state, dispatch] = React.useReducer(countReducer, { count: 0, name: '' });
  return (
    <CountStateContext.Provider value={state}>
      <CountDispatchContext.Provider value={dispatch}>
        {children}
      </CountDispatchContext.Provider>
    </CountStateContext.Provider>
  );
}
function useCountState() {
  const context = React.useContext(CountStateContext);
  if (context === undefined) {
    return () => {};
  }
  return context;
}
function useCountDispatch() {
  const context = React.useContext(CountDispatchContext);
  if (context === undefined) {
    return () => {};
  }
  return context;
}
export { CountProvider, useCountState, useCountDispatch };
