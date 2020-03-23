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
import intl from 'react-intl-universal';

import './sortproductmenu.main.less';

interface SortProductMenuProps {
  /** handle sort selection */
  handleSortSelection: (event: React.MouseEvent<HTMLElement>) => void,
  /** category model */
  categoryModel: {
    [key: string]: any
  }
}

class SortProductMenu extends Component<SortProductMenuProps, {}> {
  constructor(props) {
    super(props);
    this.handleSortSelection = this.handleSortSelection.bind(this);
  }

  handleSortSelection(event) {
    const { handleSortSelection } = this.props;
    handleSortSelection(event);
  }

  render() {
    const { categoryModel } = this.props;
    let products: any = '';
    let chosenSelect = '';
    if (categoryModel._offers) {
      [products] = categoryModel._offers;
    } else {
      products = categoryModel._items ? categoryModel : categoryModel;
    }
    if (products._sortattributes && products._sortattributes[0]._chosen) {
      chosenSelect = products._sortattributes[0]._chosen[0]._description[0]['display-name'];
      return (
        <div className="sort-product-menu">
          <div className="dropdown-sort-field">
            <p className="sort-title">{intl.get('sort-by')}</p>
            <div className="dropdown">
              <button className="btn btn-secondary dropdown-toggle " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {chosenSelect}
              </button>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                {(products._sortattributes[0]._choice) ? products._sortattributes[0]._choice.map(sortChoice => (
                  <button type="button" onClick={this.handleSortSelection} className="dropdown-item" key={sortChoice._description[0]['display-name']} id={`product_display_item_sku_option_${sortChoice._description[0]['display-name']}`} value={(sortChoice._selectaction) ? sortChoice._selectaction[0].self.uri : ''}>
                    {sortChoice._description[0]['display-name']}
                  </button>
                )) : ''}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}

export default SortProductMenu;
