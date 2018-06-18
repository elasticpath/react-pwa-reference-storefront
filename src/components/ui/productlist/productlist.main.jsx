/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { login } from '../../../utils/AuthService.js';
import ProductMain from '../product/product.main.jsx';

var Config = require('Config')

// Array of zoom parameters to pass to Cortex
var zoomArray = [
    'element',
    'element:availability',
    'element:definition',
    'element:definition:assets:element',
    'element:price',
    'element:rate',
    'element:code'
];

class ProductListMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryModel: { _items: []},
            selfHref: this.props.categoryUrl
        };
    }

    fetchData(categoryUrl) {
        if (localStorage.getItem(Config.cortexApi.scope + '_oAuthToken') === null) {
            login();
        }
        fetch(this.props.categoryUrl + '?zoom=items',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem(Config.cortexApi.scope + '_oAuthToken')
                }
            })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    selfHref: this.props.categoryUrl,
                    categoryModel: res
                });
            })
            .catch(error => {
                console.log(error)
        });
    }

    componentDidUpdate(prevProps) {
        if (this.state.selfHref !== this.props.categoryUrl) {
            this.fetchData(this.props.categoryUrl);
        }
    }
      
    componentDidMount() {
        this.fetchData(this.props.categoryUrl);
    }

    renderProducts() {
        return this.state.categoryModel["_items"][0].links.map(product => {
            return (
                <li key={'_' + Math.random().toString(36).substr(2, 9)} className="category-item-container">
                    <ProductMain productUrl={product.href}/>
                </li>
            );
        })
    }
    
    render() {
        if(this.state.categoryModel._items.length > 0) {
        return (
            <div className="category-items-container container">
    <div data-region="categoryTitleRegion" style={{ display: 'block' }}><div>
        <h1 className="view-title">{this.state.categoryModel["display-name"]}</h1>
    </div></div>
    <div data-region="categoryPaginationTopRegion" style={{ display: 'block' }}><div className="pagination-container">
        <div className="paging-total-results">
            <span className="pagination-value pagination-total-results-value">{this.state.categoryModel["_items"][0].pagination.results}</span>
            <label className="pagination-label pagination-total-results-label">results</label>
            ( <span className="pagination-value pagination-results-displayed-value">{this.state.categoryModel["_items"][0].pagination["results-on-page"]}</span>
            <label className="pagination-label">results on page</label> )
      
    </div>

        <div className="pagination-navigation-container">
            <a className="btn-pagination btn-pagination-prev pagination-link pagination-link-disabled" data-i18n="category.prev"> <span className="icon"></span>Previous</a>
            <span className="pagestate-summary">
                <label className="pagination-label">page</label>
                <span className="pagination-value pagination-curr-page-value">{this.state.categoryModel["_items"][0].pagination.current}</span>
                <label className="pagination-label">of</label>
                <span className="pagination-value pagination-total-pages-value">{this.state.categoryModel["_items"][0].pagination.pages}</span>

            </span>

            <a className="btn-pagination btn-pagination-next pagination-link pagination-link-disabled" data-i18n="category.next">Next<span className="icon"></span></a>
        </div>
    </div></div>
    <div data-region="categoryBrowseRegion" style={{ display: 'block' }}>
    <ul className="category-items-listing equalize">
        {this.renderProducts()}
    </ul>
    </div>
    <div data-region="categoryPaginationBottomRegion" style={{ display: 'block' }}><div className="pagination-container">
        <div className="paging-total-results">
            <span className="pagination-value pagination-total-results-value">{this.state.categoryModel["_items"][0].pagination.results}</span>
            <label className="pagination-label pagination-total-results-label">results</label>
            ( <span className="pagination-value pagination-results-displayed-value">{this.state.categoryModel["_items"][0].pagination["results-on-page"]}</span>
            <label className="pagination-label">results on page</label> )
      
    </div>

        <div className="pagination-navigation-container">
            <a className="btn-pagination btn-pagination-prev pagination-link pagination-link-disabled" data-i18n="category.prev"> <span className="icon"></span>Previous</a>
            <span className="pagestate-summary">
                <label className="pagination-label">page</label>
                <span className="pagination-value pagination-curr-page-value">{this.state.categoryModel["_items"][0].pagination.current}</span>
                <label className="pagination-label">of</label>
                <span className="pagination-value pagination-total-pages-value">{this.state.categoryModel["_items"][0].pagination.pages}</span>

            </span>

            <a className="btn-pagination btn-pagination-next pagination-link pagination-link-disabled" data-i18n="category.next">Next<span className="icon"></span></a>
        </div>
    </div></div>
</div>);}
else {
    return (<span>Loading or No Products Found...</span>)
}
    }
}

export default ProductListMain;