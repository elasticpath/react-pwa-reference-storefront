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
import { withRouter } from 'react-router';

var Config = require('Config')

class AppHeaderSearchMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keywords: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.search = this.search.bind(this);
    }
    handleChange(event) {
        this.setState({ keywords: event.target.value });
    }
    search(event) {
        if (this.state.keywords !== "") {
            this.props.history.push('/search/' + this.state.keywords);
        }
        event.preventDefault();
    }
    render() {
        return (
            <div>
                <div className="main-search-container" style={{ display: 'block' }}>
                    <form className="navbar-form" id="header_navbar_search_container_form" ref="form" onSubmit={this.search}>
                        <div className="form-group">
                            <input className="input-search header-search-input" id="header_navbar_search_container_input" type="text" onChange={this.handleChange} placeholder="search" />
                        </div>
                        <button className="btn-header-search" id="header_navbar_search_container_button" data-toggle="collapse" data-target=".navbar-collapse" type="submit"><span className="icon"></span>Search</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default withRouter(AppHeaderSearchMain);