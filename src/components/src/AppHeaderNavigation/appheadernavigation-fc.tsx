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

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Config from '../../../ep.config.json';
import { useFetchCategories, CategoryResult } from '../../../hooks/use-fetch-categories';
import { Menu, MenuItem } from '../Menu/Menu';

import './appheadernavigation-fc.scss';


const categoryToMenuItem = (category: CategoryResult): MenuItem => ({
  key: category.name,
  content: (category.children && category.children.length > 0)
    ? (
      <div className="navlink has-children">
        {category.displayName}
      </div>
    )
    : (<Link
        className="navlink"
        to={`/category/${category.name}`}
        aria-haspopup="true"
        aria-expanded="false"
      >
        {category.displayName}
      </Link>
    ),
  items: (category.children && category.children.length > 0) ? category.children.map(c => categoryToMenuItem(c)) : null,
});

interface AppHeaderNavigationMainProps {
  isMobileView: boolean;
}

export const AppHeaderNavigationMainFC: React.FC<AppHeaderNavigationMainProps> = (props) => {
  const { categories } = useFetchCategories();
  const menuItems = categories ? categories.map(c => categoryToMenuItem(c)) : [];
  const menuItemsFinal = Config.b2b.enable
    ? [
      { key: 'home', content: <Link className="navlink" to="/">Home</Link> },
      { key: 'company', content: <Link className="navlink" to="/company">Company</Link> },
      { key: 'products', content: <div className="navlink has-children">Products</div>, items: menuItems },
      { key: 'industries', content: <Link className="navlink" to="/industries">Industries</Link> },
      { key: 'services', content: <Link className="navlink" to="/services">Services</Link> },
      { key: 'support', content: <Link className="navlink" to="/support">Support</Link> },
    ]
    : menuItems;

  return (
    <div className="app-header-navigation-component-fc">
      <Menu className="navmenu" items={menuItemsFinal} subMenuPlacement="after" />
    </div>
  );
}
