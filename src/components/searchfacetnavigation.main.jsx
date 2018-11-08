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
import { Link } from 'react-router-dom';
import { login } from '../utils/AuthService';
import { itemLookup, cortexFetchItemLookupForm } from '../utils/CortexLookup';

import './searchfacetnavigation.main.less';

const Config = require('Config');

class SearchFacetNavigationMain extends React.Component {
  static propTypes = {
    productId: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      productData: undefined,
    };
  }

  componentDidMount() {
    const { productId } = this.props;
    login().then(() => {
      cortexFetchItemLookupForm()
        .then(() => itemLookup(productId)
          .then((res) => {
            this.setState({
              productData: res,
            });
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error.message);
          }));
    });
  }

  render() {
    const { productData } = this.state;
    if (true) {
      return (
        <div className="container">
          <div className="row">
            <div className="col-sm-3 col-md-3">
              <div className="card-group" id="accordion">
                <div className="card card-default">
                  <div className="card-header">
                    <h4 className="card-title">
                      <a data-toggle="collapse" href="#facets-1"><span className="glyphicon glyphicon-tag"></span> Taille</a>
                    </h4>
                  </div>
                  <div id="facets-1" className="card-collapse collapse in">
                    <ul className="list-group list-group-flush">
                      <div className="list-group-item checkbox checkbox-circle">
                        <input type="checkbox" name="size" id="size1" />
                        <label for="size1">100 Ko à 1 Mo</label>
                      </div>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="card card-default">
                <div className="card-header">
                  <h4 className="card-title">
                    <a data-toggle="collapse" href="#facets-2"><span className="glyphicon glyphicon-tag"></span> Créé</a>
                  </h4>
                </div>
                <div id="facets-2" className="card-collapse collapse in">
                  <ul className="list-group list-group-flush">
                    <div className="list-group-item checkbox checkbox-circle">
                      <input type="checkbox" name="created" id="created1" />
                      <label for="created1">Ce mois <span className="badge">1</span></label>
                    </div>
                    <div className="list-group-item checkbox checkbox-circle">
                      <input type="checkbox" name="created" id="created2" />
                      <label for="created2">Au cours des 6 derniers mois <span className="badge">1</span></label>
                    </div>
                    <div className="list-group-item checkbox checkbox-circle">
                      <input type="checkbox" name="created" id="created3" />
                      <label for="created3">Cette année <span className="badge">1</span></label>
                    </div>
                  </ul>
                </div>
              </div>
              <div className="card card-default">
                <div className="card-header">
                  <h4 className="card-title">
                    <a data-toggle="collapse" href="#collapse-2"><span className="glyphicon glyphicon-tag"></span> Créateur</a>
                  </h4>
                </div>
                <div id="collapse-2" className="card-collapse collapse in">
                  <ul className="list-group list-group-flush">
                    <div className="list-group-item checkbox checkbox-circle">
                      <input type="checkbox" name="createdBy" id="createdBy1" />
                      <label for="createdBy1">Moi <span className="badge">1</span></label>
                    </div>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (<div className="loader" />);
  }
}

export default SearchFacetNavigationMain;
