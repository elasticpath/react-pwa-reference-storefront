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

var Config = require('Config')

// Array of zoom parameters to pass to Cortex
var zoomArray = [
    'availability',
    'addtocartform',
    'price',
    'rate',
    'definition',
    'definition:assets:element',
    'code'
];

class ProductMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productData: undefined,
            selfHref: this.props.productUrl
        };
    }
    componentDidMount() {
        if (localStorage.getItem(Config.cortexApi.scope + '_oAuthToken') === null) {
            login();
        }
        fetch(this.props.productUrl + '?zoom=' + zoomArray.join(),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem(Config.cortexApi.scope + '_oAuthToken')
                }
            })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    productData: res
                });
            })
            .catch(error => {
                console.log(error)
            });
    }
    render() {
        console.log(this.state.productData);
        if (this.state.productData) {
            var listPrice = "n/a";
            if (this.state.productData["_price"]) {
                listPrice = this.state.productData["_price"][0]["purchase-price"][0].display;
            }
            var itemPrice = "n/a";
            if (this.state.productData["_price"]) {
                itemPrice = this.state.productData["_price"][0]["purchase-price"][0].display;
            }
            var availability = "n/a";
            if (this.state.productData["_availability"].length >= 0) {
                availability = this.state.productData["_availability"][0].state;
            }
            return (
                <div className="category-item-inner" style={{ minHeight: '292px' }}>
                    <div className="category-item-thumbnail-container">
                        <img src={Config.skuImagesS3Url.replace("%sku%", this.state.productData["_code"][0].code)} onError={(e) => { e.target.src = "images/img-placeholder.png" }} alt="default-image" className="category-item-thumbnail img-responsive" title="" />
                    </div>
                    <div className="category-item-title" style={{ minHeight: '36px' }}>
                        <Link to={"/itemdetail/" + encodeURIComponent(this.state.productData.self.href)}>{this.state.productData["_definition"][0]["display-name"]}</Link>
                    </div>
                    <div data-region="priceRegion" style={{ display: 'block' }}><div>
                        <div data-region="itemPriceRegion" style={{ display: 'block' }}><ul className="category-item-price-container" style={{ minHeight: '33px' }}>
                            <li className="category-item-list-price is-hidden" data-region="itemListPriceRegion">
                                <label className="item-meta category-item-list-price-label">Original Price</label>
                                <span className="item-meta category-item-list-price-value">{listPrice}</span>
                            </li>
                            <li className="category-item-purchase-price">
                                <label className="item-meta category-item-purchase-price-label">Price</label>
                                <span className="item-meta category-item-purchase-price-value">{itemPrice}</span>
                            </li>
                        </ul></div>
                        <div data-region="itemRateRegion"></div>
                    </div></div>
                    <div data-region="availabilityRegion" style={{ display: 'block' }}><ul className="category-item-availability-container">
                        <li className="category-item-availability itemdetail-availability-state" data-i18n="AVAILABLE">
                            <label><span className="icon"></span>{availability}</label>
                        </li>
                        <li className="category-item-release-date is-hidden" data-region="itemAvailabilityDescriptionRegion">
                            <label className="item-meta category-item-releaseDate-label">Expected Release Date: </label>
                            <span className="item-meta category-item-releaseDate-value"></span>
                        </li>
                    </ul>
                    </div>
                </div>
            );
        }
        else {
            return (<span>Loading...</span>)
        }
    }
}

export default ProductMain;