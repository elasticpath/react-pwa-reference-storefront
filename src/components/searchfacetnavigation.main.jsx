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
import { Link } from 'react-router-dom';
import { login } from '../utils/AuthService';
import cortexFetch from '../utils/Cortex';

import './searchfacetnavigation.main.less';

const Config = require('Config');

// Array of zoom parameters to pass to Cortex for searchDetails
const zoomArray = [
  'element',
  'element:availability',
  'element:definition',
  'element:definition:assets:element',
  'element:price',
  'element:rate',
  'element:code',
  'element',
  'element:availability',
  'element:definition',
  'element:definition:assets:element',
  'element:pricerange',
  'element:items',
  'element:items:element',
  'element:items:element:availability',
  'element:items:element:definition',
  'element:items:element:definition:assets:element',
  'element:items:element:price',
  'element:items:element:rate',
  'element:items:element:code',
  'facets',
  'facets:element',
  'facets:element:facetselector',
  'facets:element:facetselector:choice:description',
  'facets:element:facetselector:choice:selector',
  'facets:element:facetselector:choice:selectaction',
  'facets:element:facetselector:chosen:description',
  'facets:element:facetselector:chosen:selector',
  'facets:element:facetselector:chosen:selectaction',
];

class SearchFacetNavigationMain extends React.Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    productData: PropTypes.objectOf(PropTypes.any).isRequired,
  }

  constructor(props) {
    super(props);
    const { productData } = this.props;
    this.state = {
      facetModel: productData,
      isLoading: false,
    };
    this.handleFacetSelection = this.handleFacetSelection.bind(this);
  }

  handleFacetSelection(facetUri) {
    const { history } = this.props;
    this.setState({
      isLoading: true,
    });
    login().then(() => {
      cortexFetch(`${decodeURIComponent(facetUri)}?followlocation&zoom=offer-search-result`,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
          body: JSON.stringify({}),
        })
        .then(res => res.json())
        .then((res) => {
          this.setState({
            isLoading: false,
          });
          history.push(`/search/${encodeURIComponent(res['_offer-search-result'][0].self.uri)}`);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  renderFacetSelectorsChosen(facetselector) {
    this.funcName = 'renderFacetSelectors';
    if (facetselector[0]._chosen) {
      return facetselector[0]._chosen.map((chosen) => {
        if (chosen._description && chosen._selector) {
          return (
            <div className="list-group-item facet">
              <button type="button" className="form-check-label chosen" onClick={() => this.handleFacetSelection(encodeURIComponent(chosen._selectaction[0].self.uri))}>
                {chosen._description[0].value}
              </button>
            </div>
          );
        }
        return null;
      });
    }
    return null;
  }

  renderFacetSelectors(facetselector) {
    this.funcName = 'renderFacetSelectors';
    if (facetselector[0]._choice) {
      return facetselector[0]._choice.map((choice) => {
        if (choice._description && choice._selector) {
          return (
            <div className="list-group-item facet">
              <button type="button" className="form-check-label choice" onClick={() => this.handleFacetSelection(encodeURIComponent(choice._selectaction[0].self.uri))}>
                {choice._description[0].value}
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
    return facetModel._facets[0]._element.map((facet) => {
      if (facet.value) {
        return (
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">
                <a data-toggle="collapse" href="#facets-2">
                  <span className="glyphicon glyphicon-tag" />
                  {facet.value}
                </a>
              </h4>
            </div>
            <div id="facets-2" className="collapse navbar-collapse in">
              <ul className="list-group list-group-flush">
                {this.renderFacetSelectorsChosen(facet._facetselector)}
                {this.renderFacetSelectors(facet._facetselector)}
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
    if (facetModel._facets.length > 0) {
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
    return (<div className="loader" />);
  }
}

export default withRouter(SearchFacetNavigationMain);
