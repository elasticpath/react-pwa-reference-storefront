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

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useOnClickOutside from 'use-onclickoutside';
import Config from '../../../ep.config.json';
import { useFetchCategories, CategoryResult } from '../../../hooks/use-fetch-categories';

import './appheadernavigation.main.scss';


interface AppHeaderNavigationMainProps {
  isMobileView: boolean;
}

interface SubMenuProps {
  classNamePrefix?: string;
  categories: CategoryResult[];
  level?: number;
  prefix?: string[];
  selectedKeys: string[];
  subMenuPlacement?: 'within' | 'after';
  onCategorySelected: (e: React.MouseEvent, keys: string[], category: CategoryResult) => void;
}

const SubMenu: React.FC<SubMenuProps> = (props) => {
  const level = props.level || 0;
  const prefix = props.prefix || [];
  const selectedCategory = props.categories.filter(category => category.name === props.selectedKeys[level])[0];

  const renderSubMenu = () => selectedCategory.children && (
    <div className={`nav__submenu-container nav__submenu-container--level-${level}`}>
      <SubMenu {...props} categories={selectedCategory.children} prefix={[...prefix, selectedCategory.name]} level={level + 1} />
    </div>
  );

  return (
    <div className={`nav__sub nav__sub--level-${level}`}>
      <ul className={`nav__item-list nav__item-list--level-${level}`}>
        {props.categories.map(subCat => (
          <li
            key={subCat.name}
            className={`nav__item nav__item--level-${level} ${subCat === selectedCategory ? 'nav__item--selected' : ''}`}
          >
            <Link
              className={`nav__item-link nav__item-link--level-${level} ${(subCat.children && subCat.children.length > 0) ? 'nav__item-link--has-children' : ''}`}
              to={`/category/${subCat.name}`}
              onClick={e => props.onCategorySelected(e, prefix, subCat)}
              title={subCat.displayName}
            >
              {subCat.displayName}
            </Link>
            {props.subMenuPlacement === 'within' && subCat === selectedCategory && renderSubMenu()}
          </li>
        ))}
      </ul>
      {props.subMenuPlacement === 'after' && selectedCategory && renderSubMenu()}
    </div>
  );
};

const AppHeaderNavigationMain: React.FC<AppHeaderNavigationMainProps> = (props) => {
  const ref = React.useRef(null);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const fetchCategoriesResult = useFetchCategories();
  const fetchedCategories = fetchCategoriesResult.categories || [];

  const categories: CategoryResult[] = Config.b2b.enable
    ? [
      { name: 'home', displayName: 'Home', children: [] },
      { name: 'company', displayName: 'Company', children: [] },
      { name: 'products', displayName: 'Products', children: fetchedCategories },
      { name: 'industries', displayName: 'Industries', children: [] },
      { name: 'services', displayName: 'Services', children: [] },
      { name: 'support', displayName: 'Support', children: [] },
    ]
    : (fetchedCategories || []);

  useOnClickOutside(ref, () => {
    setSelectedNames([]);
  });

  const handleCategorySelected = (e: React.MouseEvent, prefix: string[], category: CategoryResult) => {
    if (category.children && category.children.length > 0) {
      setSelectedNames([...prefix, category.name]);
      e.preventDefault();
    } else {
      setSelectedNames([]);
    }
  };

  return (
    <div className={`app-header-navigation-component ${props.isMobileView ? 'app-header-navigation-component--mobile-view' : 'app-header-navigation-component--desktop-view'}`} ref={ref}>
      <SubMenu
        categories={categories}
        selectedKeys={selectedNames}
        onCategorySelected={handleCategorySelected}
        subMenuPlacement={props.isMobileView ? 'within' : 'after'}
      />
    </div>
  );
};

export default AppHeaderNavigationMain;
