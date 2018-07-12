/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { login } from '../utils/AuthService.js';
import { logout } from '../utils/AuthService.js';

var Config = require('Config')

class AppHeaderLoginMain extends React.Component {
    logoutRegisteredUser() {
        logout().then(() => {
            login().then(() => {
                this.props.history.push('/');
                window.location.reload();
            })
        });
        event.preventDefault();
    }
    isLoggedIn() {
        return (localStorage.getItem(Config.cortexApi.scope + '_oAuthRole') === 'REGISTERED') ? true : false;
    }
    render() {
        if (this.isLoggedIn()) {
            return (
                <li data-region="authMenuItemRegion" style={{ display: 'inline-block' }}>
                    <div className="auth-container">
                        <div className="auth-container dropdown">
                            <button className="btn btn-secondary dropdown-toggle global-nav-link global-nav-login btn-auth-menu" type="button" id="header_navbar_loggedIn_button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {localStorage.getItem(Config.cortexApi.scope + '_oAuthUserName')}
                            </button>
                            <div data-region="authMainRegion" className="auth-nav-container dropdown-menu" aria-labelledby="header_navbar_login_button" >
                                <ul data-el-container="global.profileMenu" className="auth-profile-menu-list">
                                    <li className="dropdown-item" >
                                        <Link to={"/profile"}>
                                            <span className="profile-link" id="header_navbar_login_menu_profile_link">Profile</span>
                                        </Link>
                                    </li>
                                    <li className="dropdown-item" >
                                        <button className="btn-cmd btn-auth-logout" id="header_navbar_login_menu_logout_button" data-el-label="auth.logout" onClick={() => this.logoutRegisteredUser()}><span className="icon"></span>Logout</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </li >
            );
        }
        else {
            return (
                <li data-region="authMenuItemRegion" style={{ display: 'inline-block' }}>
                    <div className="auth-container">
                        <div className="auth-container">
                            <button className="global-nav-link global-nav-login btn-auth-menu" id="header_navbar_login_button" data-toggle="modal" data-target="#login-modal">
                                Login
                            </button>
                            <div data-region="authMainRegion" className="auth-nav-container"></div>
                        </div>
                    </div>
                </li>
            );
        }
    }
}

export default withRouter(AppHeaderLoginMain);