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

import React, { FormEvent, SyntheticEvent, Component } from 'react';
import { bloomreachSuggestionSearch } from '../utils/BloomreachSearchService';
import './bloomreach.headersearch.main.less';
import { ReactComponent as SearchIcon } from '../../../images/header-icons/magnifying-glass.svg';

const intl = { get: str => str };

interface BloomreachHeaderSearchMainProps {
  /** is mobile view */
    isMobileView: boolean,
  /** is focused */
    isFocused: boolean,
  /** handle search page */
    onSearchPage?: (...args: any[]) => any,
}

interface BloomreachSuggestion {
  q: string,
  dq: string,
}

interface BloomreachHeaderSearchMainState {
    keywords: string,
    suggestions: BloomreachSuggestion[],
}

interface BloomreachSearchSuggestionResponse {
  responseHeader: {
    status: number;
    QTime: number;
  }
  response: {
    q: string;
    suggestions: BloomreachSuggestion[];
    numFound: number;
    products: [{
      url: string;
      // eslint-disable-next-line
      sale_price: number;
      pid: string;
      // eslint-disable-next-line
      thumb_image: string;
      title: string;
    }];
  };
}

class BloomreachHeaderSearchMain extends Component<BloomreachHeaderSearchMainProps, BloomreachHeaderSearchMainState> {
  private searchInput: React.RefObject<HTMLInputElement>;

  private suggestionListElements: HTMLLIElement[];

  private isTouchMoveEvent: boolean;

  static defaultProps = {
    onSearchPage: () => {},
    isFocused: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      keywords: '',
      suggestions: [],
    };
    this.searchInput = React.createRef();
    this.suggestionListElements = [];
    this.isTouchMoveEvent = false;
    this.setSuggestionsList = this.setSuggestionsList.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.search = this.search.bind(this);
    this.inputHandleKeyDown = this.inputHandleKeyDown.bind(this);
    this.liHandleKeyDown = this.liHandleKeyDown.bind(this);
    this.handleOnTouchEndOnSuggestionLiElement = this.handleOnTouchEndOnSuggestionLiElement.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { isFocused } = this.props;

    if (isFocused === true) {
      setTimeout(() => {
        this.searchInput.current.focus();
      }, 500);
    }
  }

  setSuggestionsList(element, indexOfSuggestion: number) {
    this.suggestionListElements[indexOfSuggestion] = element;
  }

  async handleChange(event) {
    const keywords: string = event.target.value;

    const res: BloomreachSearchSuggestionResponse = await bloomreachSuggestionSearch(keywords);

    let { suggestions }: { suggestions: BloomreachSuggestion[]} = res.response;
    suggestions = (suggestions === undefined) ? [] : suggestions;

    this.setState({ keywords, suggestions });
  }

  search(event?: SyntheticEvent, listElementKeyword?: string) {
    const { onSearchPage } = this.props;
    const { keywords } = this.state;

    if (listElementKeyword) {
      document.querySelector('.collapsable-container').classList.remove('show');
      onSearchPage(listElementKeyword);
    } else if (keywords !== '') {
      document.querySelector('.collapsable-container').classList.remove('show');
      onSearchPage(keywords);
    }

    this.searchInput.current.value = '';
    if (event != null) {
      event.preventDefault();
    }
  }

  liHandleKeyDown(e) {
    const currentSuggestionListIndex: number = parseInt(e.currentTarget.getAttribute('data-list-index'), 10);

    if (e.keyCode === 38) {
      if (currentSuggestionListIndex > 0 && this.suggestionListElements[currentSuggestionListIndex - 1]) {
        this.suggestionListElements[currentSuggestionListIndex - 1].focus();
      } else {
        this.searchInput.current.focus();
      }
      e.preventDefault();
    } else if (e.keyCode === 40) {
      if (currentSuggestionListIndex < this.suggestionListElements.length - 1 && this.suggestionListElements[currentSuggestionListIndex + 1]) {
        this.suggestionListElements[currentSuggestionListIndex + 1].focus();
        e.preventDefault();
      }
    } else if (e.keyCode === 13) {
      const { suggestions } = this.state;
      this.search(e, suggestions[currentSuggestionListIndex].q);
    }
  }

  inputHandleKeyDown(e) {
    if (e.keyCode === 40) {
      this.suggestionListElements[0].focus();
    }
    e.preventDefault();
  }

  handleOnTouchEndOnSuggestionLiElement(e, suggestion) {
    if (this.isTouchMoveEvent === false) {
      this.search(e, suggestion);
    }
    this.isTouchMoveEvent = false;
  }

  suggestionListHelper() {
    const { suggestions } = this.state;
    this.suggestionListElements = [];

    return suggestions.map((suggestion, i) => (
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
      <li
        className="suggestion-element"
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        ref={(e) => { this.setSuggestionsList(e, i); }}
        key={suggestion.dq}
        data-list-index={i}
        onKeyDown={this.liHandleKeyDown}
        onMouseUp={(e) => { this.search(e, suggestion.q); }}
        onTouchEnd={(e) => { this.handleOnTouchEndOnSuggestionLiElement(e, suggestion.q); }}
        onTouchMove={(e) => { this.isTouchMoveEvent = true; }}
      >
        {suggestion.dq}
      </li>
    ));
  }

  suggestionsListComponent() {
    const { suggestions } = this.state;
    if (suggestions.length !== 0) {
      return (
        <ul className="suggestions">
          { this.suggestionListHelper() }
        </ul>
      );
    }

    return null;
  }

  render() {
    const { isMobileView } = this.props;

    return (
      <div className={`main-search-container-br ${isMobileView ? 'mobile-view' : ''}`}>
        <form className="search-form-br" onSubmit={event => this.search(event)}>
          <input
            tabIndex={0}
            className="input-search-br"
            type="search"
            onChange={
              this.handleChange
            }
            placeholder={intl.get('search')}
            ref={this.searchInput}
            onKeyUp={this.inputHandleKeyDown}
          />
          <SearchIcon className="search-icon-br" />
          {this.suggestionsListComponent()}
        </form>
      </div>
    );
  }
}

export default BloomreachHeaderSearchMain;
