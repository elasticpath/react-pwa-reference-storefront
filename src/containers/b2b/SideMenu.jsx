/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
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
import PropTypes from 'prop-types';
import { Route, Link } from 'react-router-dom';
import intl from 'react-intl-universal';
import './SideMenu.less';

function SideMenuItem(props) {
  const { to, children } = props;

  return (
    <Route
      path={to}
      exact
    >
      {({ match }) => (
        <Link className={`menu-item ${match ? 'selected' : ''}`} to={props.to}>
          {children}
        </Link>
      )}
    </Route>
  );
}

SideMenuItem.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default function SideMenu() {
  return (
    <div className="side-menu-component">
      <SideMenuItem to="/b2b">{intl.get('dashboard')}</SideMenuItem>
      <SideMenuItem to="/b2b/address-book">{intl.get('address-book')}</SideMenuItem>
      <SideMenuItem to="/b2b/orders">{intl.get('orders')}</SideMenuItem>
      <SideMenuItem to="/b2b/approvals">{intl.get('approvals')}</SideMenuItem>
      <SideMenuItem to="/b2b/invitations">{intl.get('invitations')}</SideMenuItem>
      <SideMenuItem to="/b2b/requisition-lists">{intl.get('requisition-lists')}</SideMenuItem>
      <SideMenuItem to="/b2b/quotes">{intl.get('quotes')}</SideMenuItem>
    </div>
  );
}
