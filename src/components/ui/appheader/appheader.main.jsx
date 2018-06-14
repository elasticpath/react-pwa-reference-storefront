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
import AppHeaderSearchMain from '../appheadersearch/appheadersearch.main.jsx';
import AppHeaderLoginMain from '../appheaderlogin/appheaderlogin.main.jsx';
import AppHeaderNavigationMain from '../appheadernavigation/appheadernavigation.main.jsx';

class AppHeaderMain extends React.Component {
    goBack() {
        window.history.back();
    }
    render() {
        return (
            <div>
                <header className="app-header navbar navbar -fixed-top navbar-inverse" data-region="appHeader" style={{ display: 'block' }}>
                    <div className="container appheader-container">
                        <div className="back-button-container" style={{ display: 'block' }}><div>
                            <button type="button" className="navbar-back" data-region="backButtonRegion" data-el-label="navigation.back" onClick={this.goBack}>
                                <span className="icon"></span>
                            </button>
                        </div></div>
                        <div className="logo-container" style={{ display: 'block' }}>
                            <div>
                                <a href={`/`} className="cmd-home-logo">
                                    <img src={require('../../images/Company-Logo-v1.png')} />
                                </a>
                            </div>
                        </div>
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                            <span className="icon"></span>
                        </button>
                        <div className="collapse navbar-collapse">
                            <ul className="global-nav-container btn-group">
                                <AppHeaderLoginMain />
                                <li className="global-nav-cart-nav">
                                    <Link to="/mycart">
                                        <button className="global-nav-link global-nav-cart" data-toggle="collapse" data-target=".navbar-collapse">
                                            <span className="icon"></span>
                                        </button>
                                    </Link>
                                    <a className="global-nav-link" href={`mycart`}></a>
                                </li>
                            </ul>
                            <AppHeaderSearchMain />
                            <AppHeaderNavigationMain/>
                        </div>
                    </div>
                </header>
            </div>
        );
    }
}

export default AppHeaderMain;