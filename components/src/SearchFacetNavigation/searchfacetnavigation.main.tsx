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
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

import './searchfacetnavigation.main.less';

let Config: IEpConfig | any = {};
let intl = { get: str => str };

interface SearchFacetNavigationMainProps {
  productData: {
    [key: string]: any
  },
  onFacetSelection?: (res: any) => any
}

interface SearchFacetNavigationMainState {
  facetModel: any,
  showFilterMobileMenu: boolean
}

class SearchFacetNavigationMain extends React.Component<SearchFacetNavigationMainProps, SearchFacetNavigationMainState> {
  static defaultProps = {
    onFacetSelection: () => {},
  }

  constructor(props) {
    super(props);
    const { productData } = this.props;
    const epConfig = getConfig();
    Config = getConfig().config;
    ({ intl } = epConfig);
    this.state = {
      facetModel: productData,
      showFilterMobileMenu: false,
    };
    this.handleFacetSelection = this.handleFacetSelection.bind(this);
    this.handleOpenFilterMenu = this.handleOpenFilterMenu.bind(this);
    this.handleCloseFilterMenu = this.handleCloseFilterMenu.bind(this);
  }

  componentDidMount() {
    document.body.style.overflow = 'unset';
  }

  async handleFacetSelection(select) {
    const { onFacetSelection } = this.props;
    try {
      const selectstion = await select();
      // onFacetSelection(selectstion);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  renderFacetSelectorsChosen(facetselector) {
    if (facetselector.chosen) {
      return facetselector.chosen.map((chosen) => {
        console.warn(chosen);
        if (chosen._description && chosen._selector) {
          return (
            <li className="list-group-item facet-value" key={chosen.description.value}>
              <button type="button" className="form-check-label chosen" onClick={() => this.handleFacetSelection(() => {})}>
                <span className="checkmark chosen" />
                {chosen.description.value}
              </button>
            </li>
          );
        }
        return null;
      });
    }
    return null;
  }

  renderFacetSelectors(facetselector) {
    if (facetselector.choice) {
      return facetselector.choice.map((choice) => {
        if (choice.description && choice.select) {
          return (
            <li className="list-group-item facet-value" key={choice.description.value}>
              <button type="button" className="form-check-label choice" onClick={() => this.handleFacetSelection(choice.select)}>
                <span className="checkmark" />
                {`${choice.description.value} (${choice.description.count})`}
              </button>
            </li>
          );
        }
        return null;
      });
    }
    return null;
  }

  renderFacets() {
    const { facetModel } = this.state;
    return facetModel.facets.elements.map((facet) => {
      if (facet.displayName) {
        const facetDisplayNameId = facet.displayName.toLowerCase().replace(/ /g, '_');
        return (
          <div className="card" key={facet.displayName} id={`${facetDisplayNameId}_facet`}>
            <div className="card-header">
              <h4 className="card-title">
                <a className="facet" data-toggle="collapse" href={`#${facetDisplayNameId}_facet_values`}>
                  <span className="glyphicon" />
                  {facet.displayName}
                </a>
              </h4>
            </div>
            <div id={`${facetDisplayNameId}_facet_values`} className="collapse navbar-collapse in">
              <ul className="list-group list-group-flush">
                {this.renderFacetSelectorsChosen(facet.facetselector)}
                {this.renderFacetSelectors(facet.facetselector)}
              </ul>
            </div>
          </div>
        );
      }
      return null;
    });
  }

  handleOpenFilterMenu() {
    this.setState({ showFilterMobileMenu: true });
    document.body.style.overflow = 'hidden';
  }

  handleCloseFilterMenu() {
    this.setState({ showFilterMobileMenu: false });
    document.body.style.overflow = 'unset';
  }

  render() {
    const { facetModel, showFilterMobileMenu } = this.state;
    console.warn('facetModel: ', facetModel);
    if (facetModel.facets && facetModel.facets.elements && facetModel.facets.elements.length > 0) {
      const chosenFacets = facetModel.facets.elements.filter(el => el.facetselector.chosen);
      return (
        <div className="product-list-facet-navigation-component">
          <div className="col-xs-12 col-sm-12">
            <div className="filter-btn-wrap">
              <button type="button" className={`filter-btn ${chosenFacets.length > 0 ? 'filtered' : ''}`} onClick={this.handleOpenFilterMenu}>
                {intl.get('filter')}
                <span className="check-icon" />
              </button>
            </div>
            <div className={`${showFilterMobileMenu ? 'show-filter-mobile-menu' : ''} card-stack`} id="accordion">
              <div className="close-filter-mobile-menu-wrap">
                <h2>
                  {intl.get('filter')}
                </h2>
                <button type="button" className="close-filter-mobile-menu" onClick={this.handleCloseFilterMenu} />
              </div>
              <div className="facets-container">
                {this.renderFacets()}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return ('');
  }
}

export default withRouter(SearchFacetNavigationMain);
