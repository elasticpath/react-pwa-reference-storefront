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

import * as React from 'react';
import intl from 'react-intl-universal';
import './AddAssociatesMenu.less';

interface AddAssociatesMenuProps {
    onSpreeadsheetClicked?: (...args: any[]) => any,
}
interface AddAssociatesMenuState {
    isOpen: boolean,
}

export default class AddAssociatesMenu extends React.Component<AddAssociatesMenuProps, AddAssociatesMenuState> {

    static defaultProps = {
        onSpreeadsheetClicked: null,
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
                    {intl.get('add-associates')}
                </div>
                <div className={`associate-menu ${isOpen ? '' : 'hidden'}`}>
                    <div
                        className="menu-item"
                        onClick={() => this.handleUploadSpreadsheetClicked()}
                        onKeyDown={() => this.handleUploadSpreadsheetClicked()}
                        role="button"
                        tabIndex={0}
                    >
                        {intl.get('upload-spreadsheet')}
                    </div>
                    <div className="menu-item">{intl.get('download-list')}</div>
                </div>
            </div>
        );
    }
}
