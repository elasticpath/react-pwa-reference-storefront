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

class AppHeaderLoginMain extends React.Component {
    render() {
        return (
            <li data-region="authMenuItemRegion" style={{ display: 'inline-block' }}>
                <div className="auth-container">
                    <div className="auth-container">
                        <button className="global-nav-link global-nav-login btn-auth-menu" data-toggle="modal" data-target="#login-modal" data-i18n="" data-el-label="global.profile">
                            Login
                        </button>
                        <div data-region="authMainRegion" className="auth-nav-container"></div>
                    </div>
                </div>
            </li>
        );
    }
}

export default AppHeaderLoginMain;