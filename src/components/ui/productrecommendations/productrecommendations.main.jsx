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
import { withRouter } from 'react-router';
import img_placeholder from '../../images/img-placeholder.png';
import ProductListItemMain from '../productlistitem/productlistitem.main.jsx';

var Config = require('Config')

class ProductRecommendationsDisplayMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productData: this.props.productData
        };
    }
    componentWillReceiveProps(nextProps) {
        if (this.state.productData.self.href !== nextProps.productData.self.href) {
            this.setState({ categoryModel: nextProps.productData });
        }
    }
    renderProducts() {
        // Need to do this for all possible recommendations. Crosssell, Recommendation, Replacement, Upsell, Warranty.
        return this.state.productData['_recommendations'][0]['_crosssell'][0].links.map(product => {
            if (product.rel === "element") {
                return (
                    <li key={'_' + Math.random().toString(36).substr(2, 9)} className="category-item-container">
                        <ProductListItemMain productUrl={product.uri} />
                    </li>
                );
            }
        })
    }
    render() {
        if (this.state.productData.links.length > 0) {
            console.log(this.state.productData['_recommendations'][0]['_crosssell'][0])
            return (
                <div data-region="categoryBrowseRegion" style={{ display: 'block' }}>
                    <label className="control-label">Product Recommendations</label>
                    <ul className="category-items-listing equalize" id="category_items_listing">
                        {this.renderProducts()}
                    </ul>
                </div>
            );
        }
        else {
            return (<div className="loader"></div>)
        }
    }
}

export default withRouter(ProductRecommendationsDisplayMain);