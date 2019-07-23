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
import { withRouter } from 'react-router';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import { login } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';

import './searchfacetnavigation.main.less';

let Config: IEpConfig | any = {};

interface SearchFacetNavigationMainProps {
  productData: {
    [key: string]: any
  },
  onFacetSelection?: (res: any) => any
}

interface SearchFacetNavigationMainState {
  facetModel: any
}

class SearchFacetNavigationMain extends React.Component<SearchFacetNavigationMainProps, SearchFacetNavigationMainState> {
  static defaultProps = {
    onFacetSelection: () => {},
  }

  constructor(props) {
    super(props);
    const { productData } = this.props;
    Config = getConfig().config;
    this.state = {
      facetModel: productData,
    };
    this.handleFacetSelection = this.handleFacetSelection.bind(this);
  }

  handleFacetSelection(facetUri) {
    const { onFacetSelection } = this.props;
    login().then(() => {
      cortexFetch(`${decodeURIComponent(facetUri)}?followlocation=true&zoom=offersearchresult`,
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
          onFacetSelection(res);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  renderFacetSelectorsChosen(facetselector) {
    if (facetselector[0]._chosen) {
      return facetselector[0]._chosen.map((chosen) => {
        if (chosen._description && chosen._selector) {
          return (
            <li className="list-group-item facet-value" key={chosen._description[0].value}>
              <button type="button" className="form-check-label chosen" onClick={() => this.handleFacetSelection(encodeURIComponent(chosen._selectaction[0].self.uri))}>
                <span className="checkmark chosen" />
                {chosen._description[0].value}
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
    if (facetselector[0]._choice) {
      return facetselector[0]._choice.map((choice) => {
        if (choice._description && choice._selector) {
          return (
            <li className="list-group-item facet-value" key={choice._description[0].value}>
              <button type="button" className="form-check-label choice" onClick={() => this.handleFacetSelection(encodeURIComponent(choice._selectaction[0].self.uri))}>
                <span className="checkmark" />
                {`${choice._description[0].value} (${choice._description[0].count})`}
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
    return facetModel._facets[0]._element.map((facet) => {
      if (facet['display-name']) {
        const facetDisplayNameId = facet['display-name'].toLowerCase().replace(/ /g, '_');
        return (
          <div className="card" key={facet['display-name']} id={`${facetDisplayNameId}_facet`}>
            <div className="card-header">
              <h4 className="card-title">
                <a className="facet" data-toggle="collapse" href={`#${facetDisplayNameId}_facet_values`}>
                  <span className="glyphicon" />
                  {facet['display-name']}
                </a>
              </h4>
            </div>
            <div id={`${facetDisplayNameId}_facet_values`} className="collapse navbar-collapse in">
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
    if (facetModel._facets && facetModel._facets.length > 0 && facetModel._element) {
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

export default withRouter(SearchFacetNavigationMain);
