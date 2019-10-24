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
import './b2b.addassociatesmenu.less';
import { getConfig } from '../utils/ConfigProvider';

let intl = { get: str => str };

interface B2bAddAssociatesMenuProps {
    onSpreeadsheetClicked?: (...args: any[]) => any,
}
interface B2bAddAssociatesMenuState {
    isOpen: boolean,
}

export default class B2bAddAssociatesMenu extends React.Component<B2bAddAssociatesMenuProps, B2bAddAssociatesMenuState> {
    static defaultProps = {
      onSpreeadsheetClicked: null,
    };

    constructor(props) {
      super(props);
      const epConfig = getConfig();
      ({ intl } = epConfig);
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

    render() {
      const { isOpen } = this.state;
      return (
        <div
          className="add-associates-menu-component"
          onClick={e => this.handleSwitcherClicked(e)}
          onKeyDown={e => this.handleSwitcherClicked(e)}
          role="button"
          tabIndex={0}
        >
          <div className="selected-title">
            {intl.get('import-associates')}
          </div>
          <div className={`associate-menu ${isOpen ? '' : 'hidden'}`}>
            <div
              className="menu-item"
              onClick={() => this.handleUploadSpreadsheetClicked()}
              onKeyDown={() => this.handleUploadSpreadsheetClicked()}
              role="button"
              tabIndex={0}
            >
              {intl.get('upload-list')}
            </div>
            <div className="menu-item">{intl.get('download-associate-template')}</div>
          </div>
        </div>
      );
    }
}
