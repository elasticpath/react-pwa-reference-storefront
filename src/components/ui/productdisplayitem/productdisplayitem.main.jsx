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

var Config = require('Config')

// Array of zoom parameters to pass to Cortex
var zoomArray = [
    'availability',
    'addtocartform',
    'price',
    'rate',
    'definition',
    'definition:assets:element',
    'definition:options:element',
    'definition:options:element:value',
    'definition:options:element:selector:choice',
    'definition:options:element:selector:chosen',
    'definition:options:element:selector:choice:description',
    'definition:options:element:selector:chosen:description',
    'definition:options:element:selector:choice:selector',
    'definition:options:element:selector:chosen:selector',
    'definition:options:element:selector:choice:selectaction',
    'definition:options:element:selector:chosen:selectaction',
    'code'
];

class ProductDisplayItemMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productData: undefined,
            selfHref: this.props.productUrl,
            quantity: 1,
            addToCartFailedMessage: ''
        };
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.handleSkuSelection = this.handleSkuSelection.bind(this);
        this.addToCart = this.addToCart.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        login().then(() => {
            fetch(nextProps.productUrl,
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
        });
    }
    componentDidMount() {
        login().then(() => {
            fetch(this.props.productUrl + (this.props.productUrl.includes("zoom") ? '' : '?zoom=') + zoomArray.join(),
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
        });
    }
    handleQuantityChange(event) {
        this.setState({ quantity: parseInt(event.target.value) });
    }
    handleSkuSelection(event) {
        const selfHref = event.target.value;
        login().then(() => {
            fetch(selfHref + '?followlocation&zoom=' + zoomArray.join(),
                {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem(Config.cortexApi.scope + '_oAuthToken')
                    },
                    body: JSON.stringify({})
                })
                .then(res => res.json())
                .then(res => {
                    this.setState({ selfHref: res.self.href }, () => {
                        this.props.history.push('/itemdetail/' + encodeURIComponent(res.self.href));
                    });
                })
                .catch(error => {
                    console.log(error)
                });
        });
    }
    addToCart(event) {
        login().then(() => {
            fetch(this.state.productData["_addtocartform"][0].self.href,
                {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem(Config.cortexApi.scope + '_oAuthToken')
                    },
                    body: JSON.stringify({
                        quantity: this.state.quantity
                    })
                })
                .then(res => {
                    if (res.status === 200 || res.status === 201) {
                        this.props.history.push('/mycart');
                    }
                    else {
                        var debug_messages = '';
                        res.json().then(function (json) {
                            for (var message in json.messages) {
                                debug_messages = debug_messages.concat('- ' + json.messages[message]['debug-message'] + ' \n ');
                            }
                        }).then(() => this.setState({ addToCartFailedMessage: debug_messages }));
                    }
                })
                .catch(error => {
                    console.log(error)
                });
        });
        event.preventDefault();
    }
    renderSkuSelection() {
        if (this.state.productData['_definition'][0]['_options']) {
            return this.state.productData['_definition'][0]['_options'][0]['_element'].map(options => {
                return (
                    <div key={options.name} className="form-group">
                        <label className="control-label">{options['display-name']}</label>
                        <div className="form-content">
                            <select className="form-control" id={'product_display_item_sku_select_' + options['name']} name="itemdetail-select-sku" onChange={this.handleSkuSelection}>
                                <option key={options['_selector'][0]['_chosen'][0]['_description'][0]['name']} id={'product_display_item_sku_option_' + options['_selector'][0]['_chosen'][0]['_description'][0]['name']} value={(options['_selector'][0]['_chosen'][0]['_selectaction']) ? options['_selector'][0]['_chosen'][0]['_selectaction'][0].self.href : ''}>{options['_selector'][0]['_chosen'][0]['_description'][0]['display-name']}</option>
                                {(options['_selector'][0]['_choice']) ? options['_selector'][0]['_choice'].map(skuChoice => {
                                    return (
                                        <option key={skuChoice['_description'][0]['name']} id={'product_display_item_sku_option_' + skuChoice['_description'][0]['name']} value={(skuChoice['_selectaction']) ? skuChoice['_selectaction'][0].self.href : ''}>{skuChoice['_description'][0]['display-name']}</option>
                                    );
                                }) : ''}
                            </select>
                        </div>
                    </div>
                );
            })
        }
    }
    render() {
        if (this.state.productData) {
            var listPrice = "n/a";
            if (this.state.productData["_price"]) {
                listPrice = this.state.productData["_price"][0]["list-price"][0].display;
            }
            var itemPrice = "n/a";
            if (this.state.productData["_price"]) {
                itemPrice = this.state.productData["_price"][0]["purchase-price"][0].display;
            }
            var availability = false;
            var availabilityString = '';
            if (this.state.productData["_availability"].length >= 0) {
                if (this.state.productData["_availability"][0].state === "AVAILABLE") {
                    availability = true;
                    availabilityString = 'In Stock';
                }
                else if (this.state.productData["_availability"][0].state === "AVAILABLE_FOR_PRE_ORDER") {
                    availability = true;
                    availabilityString = 'Pre-order';
                }
                else if (this.state.productData["_availability"][0].state === "AVAILABLE_FOR_BACK_ORDER") {
                    availability = true;
                    availabilityString = 'Back-order';
                }
                else {
                    availability = false;
                    availabilityString = 'Out of Stock';
                }
            }
            return (
                <div className="container">
                    <div className="itemdetail-container row">

                        <div className="itemdetail-assets">
                            <div data-region="itemDetailAssetRegion" style={{ display: 'block' }}>
                                <div className="itemdetail-asset-container">
                                    <img src={Config.skuImagesS3Url.replace("%sku%", this.state.productData["_code"][0].code)} onError={(e) => { e.target.src = img_placeholder }} alt="No Image Available" className="itemdetail-main-img" />
                                </div>
                            </div>
                        </div>

                        <div className="itemdetail-details">
                            <div data-region="itemDetailTitleRegion" style={{ display: 'block' }}><div>
                                <h1 className="itemdetail-title" id={"category_item_title_" + this.state.productData["_code"][0].code}>{this.state.productData["_definition"][0]["display-name"]}</h1>
                            </div>
                            </div>
                            <div className="itemdetail-price-container" data-region="itemDetailPriceRegion" style={{ display: 'block' }}>
                                <div>
                                    <div data-region="itemPriceRegion" style={{ display: 'block' }}>
                                        <ul className="itemdetail-price-container">
                                            {
                                                listPrice !== itemPrice ?
                                                    <li className="itemdetail-list-price" data-region="itemListPriceRegion">
                                                        <label className="itemdetail-list-price-label">Original Price&nbsp;</label>
                                                        <span className="itemdetail-list-price-value" id={"category_item_list_price_" + this.state.productData["_code"][0].code}>{listPrice}</span>
                                                    </li>
                                                    : ("")
                                            }
                                            < li className="itemdetail-purchase-price">
                                                <label className="itemdetail-purchase-price-label">Price&nbsp;</label>
                                                <span className="itemdetail-purchase-price-value" id={"category_item_price_" + this.state.productData["_code"][0].code}>{itemPrice}</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div data-region="itemRateRegion"></div>
                                </div>
                            </div>
                            <div data-region="itemDetailAvailabilityRegion" style={{ display: 'block' }}>
                                <ul className="itemdetail-availability-container">
                                    <li className="itemdetail-availability itemdetail-availability-state" data-i18n="AVAILABLE">
                                        <label id={"category_item_availability_" + this.state.productData["_code"][0].code}>{(availability) ? <div><span className="icon"></span>{availabilityString}</div> : <div>{availabilityString}</div>}</label>
                                    </li>
                                    <li className={'itemdetail-release-date' + (this.state.productData["_availability"][0]['release-date'] ? '' : ' is-hidden')} data-region="itemAvailabilityDescriptionRegion">
                                        <label className="itemdetail-release-date-label" >Expected Release Date:&nbsp;</label>
                                        <span className="itemdetail-release-date-value" id={"category_item_release_date_" + this.state.productData["_code"][0].code}>{this.state.productData["_availability"][0]['release-date'] ? this.state.productData["_availability"][0]['release-date']['display-value'] : ''}</span>
                                    </li>
                                </ul>
                            </div>
                            <div data-region="itemDetailAttributeRegion" style={{ display: 'block' }}><table className="table table-striped table-condensed">
                                <tbody>
                                    <tr>
                                        <td className="itemdetail-attribute-label-col">
                                            {this.state.productData["_definition"][0]["details"][0]["display-name"]}
                                        </td>
                                        <td className="itemdetail-attribute-value-col">
                                            {this.state.productData["_definition"][0]["details"][0]["display-value"]}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="itemdetail-attribute-label-col">
                                            {this.state.productData["_definition"][0]["details"][1]["display-name"]}
                                        </td>
                                        <td className="itemdetail-attribute-value-col">
                                            {this.state.productData["_definition"][0]["details"][1]["display-value"]}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            </div>
                        </div>

                        <div className="itemdetail-addtocart col-xs-12 col-sm-10 col-md-6 col-lg-3">
                            <div data-region="itemDetailAddToCartRegion" style={{ display: 'block' }}>
                                <div>
                                    <form className="itemdetail-addtocart-form form-horizontal" ref="form" onSubmit={this.addToCart} role="form">
                                        {this.renderSkuSelection()}
                                        <div className="form-group">
                                            <label className="control-label">Quantity</label>

                                            <div className="form-content">
                                                <select className="form-control" id="product_display_item_quantity_select" name="itemdetail-select-quantity" onChange={this.handleQuantityChange}>
                                                    <option id="product_display_item_quantity_option_1" value="1">1</option>
                                                    <option id="product_display_item_quantity_option_2" value="2">2</option>
                                                    <option id="product_display_item_quantity_option_3" value="3">3</option>
                                                    <option id="product_display_item_quantity_option_4" value="4">4</option>
                                                    <option id="product_display_item_quantity_option_5" value="5">5</option>
                                                    <option id="product_display_item_quantity_option_6" value="6">6</option>
                                                    <option id="product_display_item_quantity_option_7" value="7">7</option>
                                                    <option id="product_display_item_quantity_option_8" value="8">8</option>
                                                    <option id="product_display_item_quantity_option_9" value="9">9</option>
                                                    <option id="product_display_item_quantity_option_10" value="10">10</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group form-group-submit">
                                            <div className="form-content form-content-submit col-sm-8 col-sm-offset-4">
                                                <button className={'btn-round btn btn-primary btn-itemdetail-addtocart' + (!availability ? ' disabled' : '')} id="product_display_item_add_to_cart_button" type="submit">Add to Cart</button>
                                            </div>
                                        </div>

                                        <div className="auth-feedback-container" id="product_display_item_add_to_cart_feedback_container" data-i18n="">{this.state.addToCartFailedMessage ? (this.state.addToCartFailedMessage) : ('')}</div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            );
        }
        else {
            return (<div class="loader"></div>)
        }
    }
}

export default withRouter(ProductDisplayItemMain);