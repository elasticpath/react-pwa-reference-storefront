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

import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';

import { withRouter } from 'react-router';

class AppHeaderSearchMain extends React.Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      keywords: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.search = this.search.bind(this);
  }

  handleChange(event) {
    this.setState({ keywords: event.target.value });
  }

  search(event) {
    const { history } = this.props;
    const { keywords } = this.state;
    if (keywords !== '') {
      history.push(`/search/${keywords}`);
    }
    event.preventDefault();
  }

  render() {
    return (
      <div className="main-search-container">
        <form className="navbar-form header_navbar_search_container_form" onSubmit={this.search}>
          <div className="form-group">
            <input className="input-search header-search-input header_navbar_search_container_input" type="search" onChange={this.handleChange} />
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(AppHeaderSearchMain);
