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
import { Route, Link } from 'react-router-dom';
import intl from 'react-intl-universal';
import './SideMenu.less';

interface SideMenuProps {
    location: {
        [key: string]: any,
    },
}
interface SideMenuState {
    isOpen: boolean,
    sideMenuItems: any,
}

export default class SideMenu extends React.Component<SideMenuProps, SideMenuState> {

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            sideMenuItems: [
                { to: '/b2b', children: 'dashboard' },
                // { to: '/b2b/address-book', children: 'address-book' },
                // { to: '/b2b/orders', children: 'orders' },
                // { to: '/b2b/approvals', children: 'approvals' },
                // { to: '/b2b/invitations', children: 'invitations' },
                // { to: '/b2b/requisition-lists', children: 'requisition-lists' },
                // { to: '/b2b/quotes', children: 'quotes' },
            ],
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

    render() {
        const { location } = this.props;
        const { isOpen, sideMenuItems } = this.state;
        const currentSideMenuItems = sideMenuItems.filter(el => el.to === location.pathname);
        return (
            <div className="side-menu-component">
                <button
                    className="side-menu-component-title"
                    onClick={e => this.handleSwitcherClicked(e)}
                    type="button"
                >
                    {currentSideMenuItems.length > 0 && intl.get(currentSideMenuItems[0].children)}
                </button>
                <div className={`side-menu-component-dropdown ${isOpen ? '' : 'hidden'}`}>
                    {sideMenuItems.map(elem => (
                        <div key={elem.children}>
                            <Route
                                path={elem.to}
                                exact
                            >
                                <Link className={`menu-item ${location.pathname === elem.to ? 'selected' : ''}`} to={elem.to}>
                                    {intl.get(elem.children)}
                                </Link>
                            </Route>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
