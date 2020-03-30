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
import './b2b.addassociatesmenu.less';

interface B2bAddAssociatesMenuProps {
  /** handle spreeadsheet clicked */
  onSpreeadsheetClicked?: (...args: any[]) => any;
  /** handle template clicked */
  onTemplateClicked?: (...args: any[]) => any;
}

interface B2bAddAssociatesMenuState {
    isOpen: boolean,
}

class B2bAddAssociatesMenu extends Component<B2bAddAssociatesMenuProps, B2bAddAssociatesMenuState> {
    static defaultProps = {
      onSpreeadsheetClicked: () => {},
    };

    constructor(props) {
      super(props);

      this.state = {
        isOpen: false,
      };

      this.clickListener = this.clickListener.bind(this);
    }

    handleSwitcherClicked(e) {
      this.setState({ isOpen: true });
      document.addEventListener('click', this.clickListener);

      e.preventDefault();
      e.stopPropagation();
    }

    clickListener() {
      this.setState({ isOpen: false });
      document.removeEventListener('click', this.clickListener);
    }

    handleUploadSpreadsheetClicked() {
      const { onSpreeadsheetClicked } = this.props;

      if (onSpreeadsheetClicked) {
        onSpreeadsheetClicked();
      }
    }

    handleTemplateClicked() {
      const { onTemplateClicked } = this.props;

      if (onTemplateClicked) {
        onTemplateClicked();
      }
    }

    render() {
      const { isOpen } = this.state;
      return (
        <div
          className={`add-associates-menu-component ${isOpen ? 'active-modal' : ''}`}
          onClick={e => this.handleSwitcherClicked(e)}
          onKeyDown={e => this.handleSwitcherClicked(e)}
          role="button"
          tabIndex={0}
        >
          <div className={`selected-title ${isOpen ? 'active-modal' : ''}`}>
            {intl.get('import-associates')}
          </div>
          <div className={`associate-menu ${isOpen ? 'active-modal' : 'hidden'}`}>
            <div
              className="menu-item"
              onClick={() => this.handleUploadSpreadsheetClicked()}
              onKeyDown={() => this.handleUploadSpreadsheetClicked()}
              role="button"
              tabIndex={0}
            >
              {intl.get('upload-list')}
            </div>
            <div
              className="menu-item"
              onClick={() => this.handleTemplateClicked()}
              onKeyDown={() => this.handleTemplateClicked()}
              role="button"
              tabIndex={0}
            >
              {intl.get('download-associate-template')}
            </div>
          </div>
        </div>
      );
    }
}

export default B2bAddAssociatesMenu;
