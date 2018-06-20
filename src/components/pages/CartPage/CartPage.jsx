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
import AppHeaderMain from '../../ui/appheader/appheader.main.jsx';

var Config = require('Config')

// Array of zoom parameters to pass to Cortex
var zoomArray = [
    'total',
    'lineitems:element',
    'lineitems:element:price',
    'lineitems:element:total',
    'lineitems:element:rate',
    'lineitems:element:availability',
    'lineitems:element:item',
    'lineitems:element:item:definition',
    'lineitems:element:item:definition:assets:element',
    'lineitems:element:item:rate',
    'lineitems:element:item:code',
    'lineitems:element:appliedpromotions:element',
    'appliedpromotions',
    'order',
    'order:purchaseform',
    'order:deliveries:element:shippingoptioninfo'
];

class CartPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cartData: undefined
        };
    }
    componentDidMount() {
        if (localStorage.getItem(Config.cortexApi.scope + '_oAuthToken') === null) {
            login();
        }
        fetch(Config.cortexApi.path + '/carts/' + Config.cortexApi.scope + '/default?zoom=' + zoomArray.join(),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem(Config.cortexApi.scope + '_oAuthToken')
                }
            })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    cartData: res
                });
                console.log(this.state.cartData);
            })
            .catch(error => {
                console.log(error)
            });
    }
    render() {
        if (this.state.cartData) {
            return (
                <div>
                    <AppHeaderMain />

                    <div className="cart-container container">
                        <div className="cart-container-inner">

                            <div data-region="cartTitleRegion" className="cart-title-container" style={{ display: 'block' }}><div>
                                <h1 className="view-title">Shopping Cart</h1>
                            </div></div>

                            <div data-region="mainCartRegion" className="cart-main-container" style={{ display: 'block' }}><div className="cart-main-inner table-responsive">
                                <table className="table">
                                    <thead className="cart-lineitem-table-headings">
                                        <tr>
                                            <th className="cart-heading-product"><span className="lineitem-asset-col">Product</span></th>
                                            <th className="cart-heading-name">Name</th>
                                            <th className="cart-heading-availability">Availability</th>
                                            <th className="cart-heading-item-price">Unit Price</th>
                                            <th className="cart-heading-quantity">Quantity</th>
                                            <th className="cart-heading-item-total">Total Price</th>
                                            <th className="cart-heading-remove">Remove</th>
                                        </tr>
                                    </thead>
                                    <tbody><tr>
                                        <td className="cart-lineitem-thumbnail-col" data-el-value="lineItem.thumbnail">
                                        </td>

                                        <td className="cart-lineitem-title-col" data-el-value="lineItem.displayName">
                                            <a href="#itemdetail/https%3A%2F%2Fforrester.epdemos.com%2Fcortex%2Fitems%2Fvestri%2Fqgqvhwjbkzcvgvcsjfpu2rkoknpucvcijrcviskdl5kfgscjkjkf6r2sl5ju2%3D">Product 1</a>
                                        </td>

                                        <td className="cart-lineitem-availability-col" data-region="cartLineitemAvailabilityRegion" style={{ display: 'none' }}><ul className="cart-lineitem-availability-container">
                                            <li className="cart-lineitem-availability itemdetail-availability-state" data-i18n="AVAILABLE">
                                                <label><span className="icon"></span>In Stock</label>
                                            </li>
                                            <li className="category-item-release-date is-hidden" data-region="itemAvailabilityDescriptionRegion">
                                                <label className="cart-lineitem-releasedate-label">Expected Release Date: </label>
                                                <span className="cart-lineitem-release-date-value"></span>
                                            </li>
                                        </ul></td>

                                        <td className="cart-lineitem-unit-price-col" data-region="cartLineitemUnitPriceRegion" style={{ display: 'none' }}><div>
                                            <div data-region="itemUnitPriceRegion" style={{ display: 'block' }}><ul className="cart-lineitem-price-container">
                                                <li className="cart-unit-list-price is-hidden" data-region="itemListPriceRegion"></li>
                                                <li className="cart-unit-purchase-price">$9.99</li>
                                            </ul></div>
                                            <div data-region="itemUnitRateRegion"></div>
                                        </div></td>

                                        <td className="cart-lineitem-quantity-col" data-el-value="lineItem.quantity">

                                        </td>

                                        <td className="cart-lineitem-total-price-col" data-region="cartLineitemTotalPriceRegion" style={{ display: 'none' }}><div>
                                            <div data-region="itemTotalPriceRegion" style={{ display: 'block' }}><ul className="cart-lineitem-price-container">
                                                <li className="cart-total-list-price is-hidden" data-region="itemListPriceRegion"></li>
                                                <li className="cart-total-purchase-price">$15.99</li>
                                            </ul></div>
                                            <div data-region="itemTotalRateRegion"></div>
                                        </div></td>

                                        <td className="cart-lineitem-remove-btn-col">
                                            <button className="btn btn-cart-removelineitem" data-el-label="lineItem.removeBtn" data-actionlink="https://forrester.epdemos.com/cortex/carts/vestri/hfrteytbmy2toljsge2gcljugnrtallchezgeljrga4tezjsmizdcytfgm=/lineitems/mrstmzbvmu2wgllega2taljugrrwgllbmy3gmljtmfqwcyjxmizwkndbhe=">
                                                <span className="icon"></span>
                                                <span className="btn-text">Remove</span>
                                            </button>
                                        </td>
                                    </tr></tbody>
                                </table>
                            </div></div>

                            <div className="cart-sidebar" data-region="cartCheckoutMasterRegion" style={{ display: 'block' }}><div>
                                <div className="cart-sidebar-inner">
                                    <div data-region="cartSummaryRegion" className="cart-summary-container" style={{ display: 'inline-block' }}><div>

                                        <ul className="cart-summary-list">
                                            <li className="cart-total-quantity">
                                                <label className="cart-summary-label-col">Total Quantity: </label>
                                                <span className="cart-summary-value-col" data-el-value="cart.totalQuantity">{this.state.cartData['total-quantity']}</span>
                                            </li>
                                            <li className="cart-applied-promotions is-hidden" data-region="cartAppliedPromotionsRegion">
                                                <label className="cart-summary-label-col">Applied Promotions: </label> <br />
                                                <span className="cart-summary-value-col cart-applied-promotions" data-el-value="cart.appliedPromotions"></span>
                                            </li>
                                            <li className="cart-subtotal">
                                                <label className="cart-summary-label-col">Today's Subtotal: </label>
                                                <span className="cart-summary-value-col" data-el-value="cart.subTotal">{this.state.cartData['_total'][0].cost[0].display}</span>
                                            </li>
                                        </ul>

                                    </div></div>
                                    <div data-region="cartCheckoutActionRegion" className="cart-checkout-container" style={{ display: 'block' }}><div>
                                        <button className="btn-cmd-checkout">Proceed to Checkout</button>
                                    </div></div>
                                </div>
                            </div></div>

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

export default CartPage;