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

var Config = require('Config')

class ProductDisplayItemMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productData: undefined,
            selfHref: this.props.productUrl,
            quantity: 1
        };
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.addToCart = this.addToCart.bind(this);
    }
    componentDidMount() {
        login().then(() => {
            fetch(this.props.productUrl,
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
                    this.props.history.push('/mycart');
                })
                .catch(error => {
                    console.log(error)
                });
        });
        event.preventDefault();
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
            var availability = "n/a";
            if (this.state.productData["_availability"].length >= 0) {
                availability = this.state.productData["_availability"][0].state;
            }
            return (
                <div className="container">
                    <div className="itemdetail-container row">

                        <div className="itemdetail-assets">
                            <div data-region="itemDetailAssetRegion" style={{ display: 'block' }}>
                                <div className="itemdetail-asset-container">
                                    <img src={Config.skuImagesS3Url.replace("%sku%", this.state.productData["_code"][0].code)} onError={(e) => { e.target.src = "images/img-placeholder.png" }} alt="No Image Available" className="itemdetail-main-img" />
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
                                    <div data-region="itemPriceRegion" style={{ display: 'block' }}><ul className="itemdetail-price-container">
                                        <li className="itemdetail-list-price is-hidden" data-region="itemListPriceRegion">
                                            <label className="itemdetail-list-price-label">Original Price</label>
                                            <span className="itemdetail-list-price-value" id={"category_item_list_price_" + this.state.productData["_code"][0].code}>{listPrice}</span>
                                        </li>
                                        <li className="itemdetail-purchase-price">
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
                                        <label id={"category_item_availability_" + this.state.productData["_code"][0].code}><span className="icon"></span>{availability}</label>
                                    </li>
                                    <li className="itemdetail-release-date is-hidden" data-region="itemAvailabilityDescriptionRegion">
                                        <label className="itemdetail-release-date-label" >Expected Release Date: </label>
                                        <span className="itemdetail-release-date-value" id={"category_item_release_date_" + this.state.productData["_code"][0].code}></span>
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

                        <div className="itemdetail-addtocart">
                            <div data-region="itemDetailAddToCartRegion" style={{ display: 'block' }}>
                                <div>
                                    <form className="itemdetail-addtocart-form form-horizontal" ref="form" onSubmit={this.addToCart} role="form">

                                        <div className="form-group">
                                            <label className="control-label col-sm-4">Quantity</label>

                                            <div className="form-content col-sm-8">
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
                                                <button className="btn-round btn btn-primary btn-itemdetail-addtocart" id="product_display_item_add_to_cart_button" type="submit">Add to Cart</button>
                                            </div>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return (<span>Loading...</span>)
        }
    }
}

export default withRouter(ProductDisplayItemMain);