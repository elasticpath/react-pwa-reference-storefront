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
    focusedElement?: HTMLElement,
    suggestions: [],
    liElements?: {},
}

class BloomreachHeaderSearchMain extends React.Component<BloomreachHeaderSearchMainProps, BloomreachHeaderSearchMainState> {
  private searchInput: React.RefObject<HTMLInputElement>;
  private suggestionList: HTMLLIElement[];
  private suggestionIndex: number;
  
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
    this.suggestionList = [];
    this.suggestionIndex = 0;
    // this.suggestionList = this.suggestionList.bind(this);
    this.setSuggestionsList = this.setSuggestionsList.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.search = this.search.bind(this);
    this.inputHandleKeyDown = this.inputHandleKeyDown.bind(this);
    this.liHandleKeyDown = this.liHandleKeyDown.bind(this);
  }

  setSuggestionsList(element) {
    console.log('printing the type of element', element.constructor.name);
    this.suggestionList.push(element);
  }

  inputOnFocus(element) {
    // 
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

  liHandleKeyDown(e) {
    if (e.keyCode === 38) {
      this.suggestionIndex = this.suggestionIndex - 1;
      this.suggestionList[this.suggestionIndex].focus();
    } else if (e.keyCode === 40) {
      this.suggestionIndex = this.suggestionIndex + 1;
      this.suggestionList[this.suggestionIndex].focus();
    }

    e.preventDefault();
  }

  inputHandleKeyDown(e) {
    if (e.keyCode === 40) {
      this.suggestionList[0].focus();
    }
    e.preventDefault();
  }

  suggestionListHelper() {
    const { suggestions } = this.state;

    return suggestions.map(suggestion=> {
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        // Must figure out how keydown will work properly...
        return (
        <li className="suggestion-element" 
            tabIndex={0} 
            ref={this.setSuggestionsList} 
            onFocus={this.liOnFocus} 
            key={suggestion} 
            onKeyDown={this.liHandleKeyDown} 
            onMouseDown={() => this.handleSuggestionClicked(suggestion)}
        >
          {suggestion}
        </li>
        );
      }
    );
  }

  suggestionsListComponent() {
    const { suggestions } = this.state;
    if (suggestions.length !== 0) {
      const currentlyFocusedElementClassName = document.activeElement.className;
      if (currentlyFocusedElementClassName == 'input-search' || currentlyFocusedElementClassName == 'suggestion-element') {
        return (
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
          <input tabIndex={0} className="input-search" type="search" onChange={this.handleChange} placeholder={intl.get('search')} ref={this.searchInput} onFocus={this.inputOnFocus} onBlur={this.inputOnFocusOut} onKeyUp={this.inputHandleKeyDown} />
          <div className="search-icon" />
          {this.suggestionsListComponent()}
        </form>
      </div>
    );
  }
}

export default BloomreachHeaderSearchMain;
