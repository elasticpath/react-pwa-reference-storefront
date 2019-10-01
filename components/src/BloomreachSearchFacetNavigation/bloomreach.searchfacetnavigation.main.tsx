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
import { withRouter } from 'react-router';
import { BloomreachSearchFacetNavigationMainProps, BloomreachSearchResultsNavigationMainState } from './types/bloomreach.searchfacetnavigation.main';
import './bloomreach.searchfacetnavigation.main.less';

class BloomreachSearchFacetNavigationMain extends React.Component<BloomreachSearchFacetNavigationMainProps, BloomreachSearchResultsNavigationMainState> {
  static removeSelectedFacet(facetUriStr, facetKey, facetName) {
    const splitFilters = facetUriStr.split('-');
    const facetUriStrElement = `${facetKey}:"${facetName}"`;
    const removeFacetSelection = splitFilters.filter((element) => {
      if (element === facetUriStrElement) {
        return false;
      }
      return true;
    });

    return removeFacetSelection.join('-');
  }

  static turnQueryParamsIntoTree(queryParams: string) {
    // Turns the url query parameter into object to represent state
    // Ex. ?fq=colors:"black"OR"red"&fq=category:"cat250"
    // Ex. ['colors: "black"', 'category: "cat250"']
    // Ex {colors: ["black"], category: "cat250"}
    const decodedQueryParams = decodeURI(queryParams);
    
    let filteredQueryParamsArray: string[] = [];
    
    if (decodedQueryParams) {
      let filteredQueryParams: string = decodedQueryParams.replace('?', '');
      if (filteredQueryParams.includes('fq=')) {
        filteredQueryParamsArray = filteredQueryParams.split('fq=');
        filteredQueryParamsArray = filteredQueryParamsArray.map(params => params.replace('&', ''));
      } else {
        return {}
      }
    }
    
    const filteredQueryParamsTree = filteredQueryParamsArray.reduce((acc, outerFacetStr:string) => {
      if (outerFacetStr) {
        const outerFacetArray = outerFacetStr.split(':');
        const category = outerFacetArray[0];
        const loFacets = outerFacetArray[1].split('"OR"');
        loFacets.forEach((innerFacet) => {
          const innerFacetWithoutQuotes = innerFacet.replace(/['"]+/g, '');
          if (acc[category] == null) {
            acc[category] = [innerFacetWithoutQuotes];
          } else {
            acc[category].push(innerFacetWithoutQuotes);
          }
        });
      }

      return acc;
    }, {});
    
    return filteredQueryParamsTree;
  }

  constructor(props) {
    super(props);
    const { productData, categoryMap } = this.props;

    this.state = {
      facetModel: productData,
      currentFacets: BloomreachSearchFacetNavigationMain.turnQueryParamsIntoTree(window.location.search),
      categoryMap,
    };

    this.handleFacetSelection = this.handleFacetSelection.bind(this);
    this.addFacetFromQueryParamsTree = this.addFacetFromQueryParamsTree.bind(this);
    this.renderFacetSelectors = this.renderFacetSelectors.bind(this);
    this.renderFacets = this.renderFacets.bind(this);
  }

  removeFacetFromQueryParamsTree(facetKey, facetName, onFacetFinishUpdate) {
    const { currentFacets } = this.state;
    const filteredCurrentFacets = currentFacets[facetKey].filter((facet) => {
      if (facet.includes(facetName)) {
        return false;
      }

      return true;
    });

    if (filteredCurrentFacets.length === 0) {
      delete currentFacets[facetKey];
    } else {
      currentFacets[facetKey] = filteredCurrentFacets;
    }

    this.setState({
      currentFacets,
    },
    onFacetFinishUpdate);
  }

  addFacetFromQueryParamsTree(facetKey, facetName, onFacetFinishUpdate) {
    const { currentFacets } = this.state;

    if (currentFacets[facetKey] == null) {
      currentFacets[facetKey] = [facetName];
    } else {
      currentFacets[facetKey].push(facetName);
    }

    this.setState({
      currentFacets,
    },
    onFacetFinishUpdate);
  }

  reconstructTreeIntoQueryParamsString() {
    const { currentFacets } = this.state;
    const paramArray = [];
    Object.keys(currentFacets).forEach(
      (facetCategory) => {
        let facetStr = `fq=${facetCategory}:`;
        currentFacets[facetCategory].forEach((innerFacet) => {
          if (facetStr.charAt(facetStr.length - 1) === ':') {
            facetStr = `${facetStr}"${innerFacet}"`;
          } else {
            facetStr = `${facetStr}OR"${innerFacet}"`;
          }
        });
        paramArray.push(facetStr);
      },
    );
    const queryParams = paramArray.join('&');
    return queryParams ? `?${queryParams}` : '';
  }

  handleFacetSelection(facetKey, facetId) {
    const { history, titleString, onFacetSelected } = this.props;
    const { keywords } = titleString;

    const onFacetFinishUpdate = () => {
      const facets = this.reconstructTreeIntoQueryParamsString();
      window.history.pushState('', '', `/search/${keywords}${facets}`);
      onFacetSelected(facets);
    };

    if (this.hasFacetBeenSelected(facetKey, facetId)) {
      this.removeFacetFromQueryParamsTree(facetKey, facetId, onFacetFinishUpdate);
    } else {
      this.addFacetFromQueryParamsTree(facetKey, facetId, onFacetFinishUpdate);
    }
  }

  hasFacetBeenSelected(facetKey, facetName) {
    const { currentFacets } = this.state;

    if (currentFacets[facetKey]) {
      return currentFacets[facetKey].some((facet) => {
        if (facet.includes(facetName)) {
          return true;
        }
        return false;
      });
    }

    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  generateFacetName(facetKey, name, choice) {
    const { categoryMap } = this.state;

    if (choice.crumb) {
      const crumbs = choice.crumb.split('/');
      const crumbNames = crumbs.map((categoryCode) => {
        if (categoryCode) {
          return categoryMap[categoryCode];
        }
        return '';
      });

      const filteredCrumbNames = crumbNames.filter((currentName) => {
        if (currentName) {
          return true;
        }
        return false;
      });
      return filteredCrumbNames.join(' : ');
    }

    return name;
  }

  renderFacetSelectors(facetKey, facetselector) {
    if (facetselector) {
      return facetselector.map((choice, index) => {
        if (choice) {
          const name = choice.name ? choice.name : choice.cat_name;
          const count = choice.count ? choice.count : 'n/a';
          const domKey = choice.cat_id ? `${choice.cat_id}:${index}` : `${name}:${index}`;
          const id = choice.cat_id ? `${choice.cat_id}` : `${name}`;

          if (!this.hasFacetBeenSelected(facetKey, id)) {
            return (
              <div className="list-group-item facet-value" key={domKey}>
                <button type="button" className="form-check-label choice" onClick={() => this.handleFacetSelection(facetKey, id)}>
                  <span className="checkmark choice" />
                  {`${this.generateFacetName(facetKey, name, choice)}`}
                </button>
                <div className="facet-count">
                  <div className="circle">{count}</div>
                </div>
              </div>
            );
          }

          return (
            <div className="list-group-item facet-value" key={domKey}>
              <button type="button" className="form-check-label chosen" onClick={() => this.handleFacetSelection(facetKey, id)}>
                <span className="checkmark chosen" />
                {`${this.generateFacetName(facetKey, name, choice)}`}
              </button>
              <div className="facet-count">
                <div className="circle">{count}</div>
              </div>
            </div>
          );
        }
        return null;
      });
    }
    return null;
  }

  shouldUncollapseFacet(facetKey, index) {
    const { currentFacets } = this.state;
    // uncollapse the first facet if nothing is clicked.
    if (Object.keys(currentFacets).length === 0 && index === 0) {
      return true;
    }
    // uncollapse facet that has a checkbox.
    if (Object.prototype.hasOwnProperty.call(currentFacets, facetKey)) {
      return true;
    }

    return false;
  }

  renderFacets() {
    const { facetModel } = this.state;

    return Object.keys(facetModel).map((facetKey, index) => {
      if (facetKey && facetModel[facetKey].length > 0) {
        const facetDisplayNameId = facetKey.toLowerCase().replace(/ /g, '_');
        const facetCategoryChildren = facetModel[facetKey];

        return (
          <div className="card" key={facetKey} id={`${facetDisplayNameId}_facet`}>
            <div className="card-header">
              <h4 className="card-title">
                <div className="facet" data-toggle="collapse" data-target={`#${facetDisplayNameId}_facet_values`}>
                  <span className="glyphicon" />
                  {facetKey}
                </div>
              </h4>
            </div>
            <div id={`${facetDisplayNameId}_facet_values`} className={this.shouldUncollapseFacet(facetKey, index) ? 'collapse show' : 'collapse'}>
              <ul className="list-group list-group-flush">
                {this.renderFacetSelectors(facetKey, facetCategoryChildren)}
              </ul>
            </div>
          </div>
        );
      }
      return null;
    });
  }

  render() {
    const { facetModel } = this.state;

    if (facetModel) {
      return (
        <div className="product-list-facet-navigation-component">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div className="card-stack" id="accordion">
              {this.renderFacets()}
            </div>
          </div>
        </div>
      );
    }
    return ('');
  }
}

export default withRouter(BloomreachSearchFacetNavigationMain);
