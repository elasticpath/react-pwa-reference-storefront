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

import React, { FormEvent } from 'react';
import { bloomreachSuggestionSearch } from '../utils/BloomreachSearchService';
import './bloomreach.headersearch.main.less';

const intl = { get: str => str };

interface BloomreachHeaderSearchMainProps {
    isMobileView: boolean,
    onSearchPage?: (...args: any[]) => any,
}
interface BloomreachHeaderSearchMainState {
    keywords: string,
    suggestions: [],
    focusedElement?: HTMLElement,
    liElements?: {},
}

class BloomreachHeaderSearchMain extends React.Component<BloomreachHeaderSearchMainProps, BloomreachHeaderSearchMainState> {
  private searchInput: React.RefObject<HTMLInputElement>;

  static defaultProps = {
    onSearchPage: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
      keywords: '',
      suggestions: [],
      focusedElement: null,
      liElements: {}
    };
    this.searchInput = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.search = this.search.bind(this);
    this.inputOnFocusOut = this.inputOnFocusOut.bind(this);
    this.inputOnFocus = this.inputOnFocus.bind(this);
    this.liOnFocus = this.liOnFocus.bind(this);
  }

  inputOnFocus(element) {
    this.setState({focusedElement:element.currentTarget}, () => {
      const suggestionContainer = document.getElementsByClassName('suggestions');

      // if (suggestionContainer !== undefined && suggestionContainer.length > 0) {
      //   suggestionContainer[0].setAttribute('style', 'display: list-item;');
      // }
    });
  }

  inputOnFocusOut(event) {
    // Need to get the element that is focused out...
    // Only close the suggestion container if the list inside is not selected.
    
    // console.log('inputOnFocusOut');
    // console.log(document.activeElement);
    // console.log(document.hasFocus());
    // const suggestionContainer = document.getElementsByClassName('suggestions');
    // const { focusedElement } = this.state;
    // console.log('focusedElement', focusedElement);
    // console.log(focusedElement.DOCUMENT_TYPE_NODE);
    // console.log(document.querySelector(":focus"));
    // if (suggestionContainer !== undefined && suggestionContainer.length > 0 && !focusedElement.DOCUMENT_TYPE_NODE) {
    //   suggestionContainer[0].setAttribute('style', 'display: none;');
    // }
  }

  liOnFocusOut(event) {
    // console.log(document.activeElement);
  }

  liOnFocus(event) {
    // console.log('lionfocus running');
    // this.setState({focusedElement: event.target},()=>{
    //   console.log();
    // });
  }

  handleChange(event) {
    const keywords = event.target.value;

    bloomreachSuggestionSearch(keywords)
      .then((res) => {
        const brSuggestions = res.response.suggestions;
        const suggestions = brSuggestions ? brSuggestions.map(suggestion => suggestion.dq) : [];

        this.setState({
          keywords,
          suggestions,
        });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
      });
  }

  search(event?: FormEvent<HTMLFormElement>) {
    const { onSearchPage } = this.props;
    const { keywords } = this.state;

    if (keywords !== '') {
      document.querySelector('.collapsable-container').classList.remove('show');
      onSearchPage(keywords);
    }

    this.searchInput.current.value = '';
    if (event != null) {
      event.preventDefault();
    }
  }

  handleSuggestionClicked(suggestion) {
    this.setState(
      {
        keywords: suggestion,
        suggestions: [],
      },
      this.search,
    );
  }

  suggestionListHelper() {
    const { suggestions } = this.state;

    return suggestions.map(suggestion=> {
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        return (<li className="suggestion-element" tabIndex={0} onFocus={this.liOnFocus} key={suggestion} onMouseDown={() => this.handleSuggestionClicked(suggestion)}>
          {suggestion}
        </li>);
      }
    );
  }

  suggestionsListComponent() {
    const { suggestions } = this.state;
    if (suggestions.length !== 0) {
      const currentlyFocusedElementClassName = document.activeElement.className;
      if (currentlyFocusedElementClassName == 'input-search' || currentlyFocusedElementClassName == 'suggestion-element') {
        console.log('the currently focused element classname');
        console.log(currentlyFocusedElementClassName);  
        return (
          // TODO: Should create a reference to this suggestion here...
          <ul className="suggestions">
            { this.suggestionListHelper() }
          </ul>
        );  
      }
    }

    return null;
  }

  render() {
    const { isMobileView } = this.props;

    return (
      <div className={`main-search-container ${isMobileView ? 'mobile-view' : ''}`}>
        <form className="search-form" onSubmit={event => this.search(event)}>
          <input tabIndex={0} className="input-search" type="search" onChange={this.handleChange} placeholder={intl.get('search')} ref={this.searchInput} onFocus={this.inputOnFocus} onBlur={this.inputOnFocusOut} />
          <div className="search-icon" />
          {this.suggestionsListComponent()}
        </form>
      </div>
    );
  }
}

export default BloomreachHeaderSearchMain;
