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
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import './bloomreach.searchfacetnavigation.main.less';

interface BloomreachSearchFacetNavigationMainProps {
    productData: any,
    titleString: any,
    categoryMap: any,
    currentFacets: any,
    history: any,
}

interface BloomreachSearchResultsNavigationMainState {
    facetModel: any,
    currentFacets: any,
    categoryMap: any,
}

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

  static turnQueryParamsIntoTree(queryParams) {
    // Ex. ?fq=colors:"black"OR"red"&fq=category:"cat250"
    // Ex. ['colors: "black"', 'category: "cat250"']
    // Ex {colors: ["black"], category: "cat250"}
    // TODO: Make this one large regex expression.
    const filteredQueryParams: [] = [];

    if (queryParams) {
        let filteredQueryParams = queryParams.replace('?', '');
        filteredQueryParams = filteredQueryParams.replace(/['"]+/g, '');
        filteredQueryParams = filteredQueryParams.split('fq=');
        filteredQueryParams = filteredQueryParams.map(params => params.replace('&', ''));
    }

    const filteredQueryParamsTree = filteredQueryParams.reduce((acc, outerFacetStr:string) => {
      if (outerFacetStr) {
          const outerFacetArray = outerFacetStr.split(':');
          const category = outerFacetArray[0];
          const loFacets = outerFacetArray[1].split('OR');

          loFacets.forEach((innerFacet) => {
          if (acc[category] == null) {
              acc[category] = [innerFacet];
          } else {
              acc[category].push(innerFacet);
          }
          });
      }

      return acc;
    }, {});

    return filteredQueryParamsTree;
    
  }

  constructor(props) {
    super(props);
    const { productData, currentFacets, categoryMap } = this.props;

    this.state = {
      facetModel: productData,
      currentFacets: BloomreachSearchFacetNavigationMain.turnQueryParamsIntoTree(currentFacets),
      categoryMap,
    };
    this.handleFacetSelection = this.handleFacetSelection.bind(this);
    this.addFacetFromQueryParamsTree = this.addFacetFromQueryParamsTree.bind(this);
    this.renderFacetSelectors = this.renderFacetSelectors.bind(this);
    this.renderFacets = this.renderFacets.bind(this);
  }

  removeFacetFromQueryParamsTree(facetKey, facetName) {
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
    });
  }

  addFacetFromQueryParamsTree(facetKey, facetName) {
    const { currentFacets } = this.state;

    if (currentFacets[facetKey] == null) {
      currentFacets[facetKey] = [facetName];
    } else {
      currentFacets[facetKey].push(facetName);
    }
    
    this.setState({
      currentFacets,
    }
    );
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
  
  componentDidUpdate(prevProps, prevState) {
    const { titleString } = this.props;
    const { keywords } = titleString;
    
    const facets = this.reconstructTreeIntoQueryParamsString();
    
    window.history.pushState('', '', `/search/${keywords}${facets}`);
  }

  handleFacetSelection(facetKey, facetId) {
    const { history, titleString } = this.props;
    const { keywords } = titleString;

    if (this.hasFacetBeenSelected(facetKey, facetId)) {
      this.removeFacetFromQueryParamsTree(facetKey, facetId);
    } else {
      this.addFacetFromQueryParamsTree(facetKey, facetId);
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
  findAllParentCategories(categoryMap) {
    const parentCategories = {};
    Object.keys(categoryMap).forEach((categoryKey) => {
      const l = categoryKey.length;
      const lastTwoDigits = categoryKey.substring(l - 3, l - 1);
      if (lastTwoDigits === '00') {
        parentCategories[categoryKey] = categoryMap[categoryKey];
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  isCategoryCodeParent(categoryCode) {
    const l = categoryCode.length;
    const lastTwoDigits = categoryCode.substring(l - 2, l);
    if (lastTwoDigits === '00') {
      return true;
    }
    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  findParent(facetselector, choice) {
    const { categoryMap } = this.state;
    // const parentCategories = this.findAllParentCategories(categoryMap);
    const id = choice.cat_id;
    const choicePrefix = id.substring(0, id.length - 2);
    const choiceSelector = `${choicePrefix}00`;

    const parent = categoryMap[choiceSelector];
    return parent;
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
    // this.funcName = 'renderFacetSelectors';

    if (facetselector) {
      return facetselector.map((choice) => {
        if (choice) {
          const name = choice.name ? choice.name : choice.cat_name;
          const id = choice.cat_id ? `${choice.cat_id}` : `${name}`;
          if (!this.hasFacetBeenSelected(facetKey, id)) {
            return (
              <div className="list-group-item facet-value" key={id}>
                <button type="button" className="form-check-label choice" onClick={() => this.handleFacetSelection(facetKey, id)}>
                  <span className="checkmark choice" />
                  {`${this.generateFacetName(facetKey, name, choice)}`}
                </button>
              </div>
            );
          }

          return (
            <div className="list-group-item facet-value" key={id}>
              <button type="button" className="form-check-label chosen" onClick={() => this.handleFacetSelection(facetKey, id)}>
                <span className="checkmark chosen" />
                {`${this.generateFacetName(facetKey, name, choice)}`}
              </button>
            </div>
          );
        }
        return null;
      });
    }
    return null;
  }

  renderFacets() {
    const { facetModel } = this.state;

    return Object.keys(facetModel).map((facetKey) => {
      if (facetKey && facetModel[facetKey].length > 0) {
        const facetDisplayNameId = facetKey.toLowerCase().replace(/ /g, '_');
        const facetCategoryChildren = facetModel[facetKey];
        return (
          <div className="card" key={facetKey} id={`${facetDisplayNameId}_facet`}>
            <div className="card-header">
              <h4 className="card-title">
                <a className="facet" data-toggle="collapse" href={`#${facetDisplayNameId}_facet_values`}>
                  <span className="glyphicon glyphicon-tag" />
                  {facetKey}
                </a>
              </h4>
            </div>
            <div id={`${facetDisplayNameId}_facet_values`} className="collapse navbar-collapse in">
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
    const { facetModel, currentFacets } = this.state;
    
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
