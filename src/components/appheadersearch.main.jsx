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
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router';

import './appheadersearch.main.less';

class AppHeaderSearchMain extends React.Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    isMobileView: PropTypes.bool.isRequired,
    isFocused: PropTypes.bool,
  }

  static defaultProps = {
    isFocused: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      keywords: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.search = this.search.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isFocused === true) {
      setTimeout(() => {
        this.searchInput.focus();
      }, 500);
    }
  }

  handleChange(event) {
    this.setState({ keywords: event.target.value });
  }

  search(event) {
    const { history } = this.props;
    const { keywords } = this.state;
    if (keywords !== '') {
      document.querySelector('.collapsable-container').classList.remove('show');
      history.push(`/search/${keywords}`);
    }
    this.searchInput.value = '';
    event.preventDefault();
  }

  render() {
    const { isMobileView } = this.props;

    return (
      <div className={`main-search-container ${isMobileView ? 'mobile-view' : ''}`}>
        <form className="search-form" onSubmit={this.search}>
          <input className="input-search" type="search" onChange={this.handleChange} placeholder={intl.get('search')} ref={(input) => { this.searchInput = input; }} />
          <div className="search-icon" />
        </form>
      </div>
    );
  }
}

export default withRouter(AppHeaderSearchMain);
