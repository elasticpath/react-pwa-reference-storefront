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

class AppHeaderSearchMain extends React.Component {
    render() {
        return (
            <div>
                <div className="main-search-container" style={{ display: 'block' }}><form className="navbar-form">
                    <div className="form-group">
                        <input className="input-search header-search-input" type="text" placeholder="search" />
                    </div>
                    <button className="btn-header-search" data-toggle="collapse" data-target=".navbar-collapse"><span className="icon"></span>Search</button>
                </form></div>
            </div>
        );
    }
}

export default AppHeaderSearchMain;