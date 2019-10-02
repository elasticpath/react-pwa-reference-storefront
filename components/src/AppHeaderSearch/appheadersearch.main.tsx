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

import './appheadersearch.main.less';
import { getConfig } from '../utils/ConfigProvider';
import { ReactComponent as SearchIcon } from '../../../app/src/images/header-icons/magnifying-glass.svg';

let intl = { get: str => str };

interface AppHeaderSearchMainProps {
    isMobileView: boolean,
    isFocused?: boolean,
    onSearchPage?: (...args: any[]) => any,
}
interface AppHeaderSearchMainState{
    keywords: string,
}

class AppHeaderSearchMain extends React.Component<AppHeaderSearchMainProps, AppHeaderSearchMainState> {
  private searchInput: React.RefObject<HTMLInputElement>;

  static defaultProps = {
    isFocused: false,
    onSearchPage: () => {},
  }

  constructor(props) {
    super(props);
    ({ intl } = getConfig());
    this.state = {
      keywords: '',
    };
    this.searchInput = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.search = this.search.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { isFocused } = this.props;

    if (isFocused === true) {
      setTimeout(() => {
        this.searchInput.current.focus();
      }, 500);
    }
  }

  handleChange(event) {
    this.setState({ keywords: event.target.value });
  }

  search(event) {
    const { onSearchPage } = this.props;
    const { keywords } = this.state;
    if (keywords !== '') {
      document.querySelector('.collapsable-container').classList.remove('show');
      onSearchPage(keywords);
    }
    this.searchInput.current.value = '';
    event.preventDefault();
  }

  render() {
    const { isMobileView } = this.props;

    return (
      <div className={`main-search-container ${isMobileView ? 'mobile-view' : ''}`}>
        <form className="search-form" onSubmit={this.search}>
          <input className="input-search" type="search" onChange={this.handleChange} placeholder={intl.get('search')} ref={this.searchInput} />
          <SearchIcon className="search-icon" />
        </form>
      </div>
    );
  }
}

export default AppHeaderSearchMain;
