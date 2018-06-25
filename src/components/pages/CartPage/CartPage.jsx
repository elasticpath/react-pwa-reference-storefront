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
import AppHeaderMain from '../../ui/appheader/appheader.main.jsx';
import AppFooterMain from '../../ui/appfooter/appfooter.main.jsx';
import CartMain from '../../ui/cart/cart.main.jsx';

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
    fetchCartData() {
        login().then(() => {
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
                }, () => { console.log(this.state.cartData) });
            })
            .catch(error => {
                console.log(error)
            });
        });
    }
    componentDidMount() {
        this.fetchCartData();
    }
    handleQuantityChange() {
        this.fetchCartData();
    }
    render() {
        if (this.state.cartData) {
            return (
                <div>
                    <AppHeaderMain />
                    <div className="cart-container container">
                        <div className="cart-container-inner">
                            <div data-region="cartTitleRegion" className="cart-title-container" style={{ display: 'block' }}>
                                <div>
                                    <h1 className="view-title">Shopping Cart</h1>
                                </div>
                            </div>
                            <div data-region="mainCartRegion" className="cart-main-container" style={{ display: 'block' }}>
                                <CartMain empty={!this.state.cartData['total-quantity']} cartData={this.state.cartData} handleQuantityChange={() => { this.handleQuantityChange() }} />
                            </div>
                            <div className="cart-sidebar" data-region="cartCheckoutMasterRegion" style={{ display: 'block' }}>
                                <div>
                                    <div className="cart-sidebar-inner">
                                        <div data-region="cartSummaryRegion" className="cart-summary-container" style={{ display: 'inline-block' }}>
                                            <div>
                                                <ul className="cart-summary-list">
                                                    <li className="cart-total-quantity">
                                                        <label className="cart-summary-label-col">Total Quantity:&nbsp;</label>
                                                        <span className="cart-summary-value-col" data-el-value="cart.totalQuantity">{this.state.cartData['total-quantity']}</span>
                                                    </li>
                                                    <li className="cart-applied-promotions is-hidden" data-region="cartAppliedPromotionsRegion">
                                                        <label className="cart-summary-label-col">Applied Promotions:&nbsp;</label>
                                                        <br />
                                                        <span className="cart-summary-value-col cart-applied-promotions" data-el-value="cart.appliedPromotions"></span>
                                                    </li>
                                                    <li className="cart-subtotal">
                                                        <label className="cart-summary-label-col">Today's Subtotal:&nbsp;</label>
                                                        <span className="cart-summary-value-col" data-el-value="cart.subTotal">{this.state.cartData['_total'][0].cost[0].display}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div data-region="cartCheckoutActionRegion" className="cart-checkout-container" style={{ display: 'block' }}>
                                            <div>
                                                <button className="btn-cmd-checkout" disabled={!this.state.cartData['total-quantity']}>Proceed to Checkout</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <AppFooterMain />
                </div>
            );
        }
        else {
            return (<span>Loading...</span>)
        }
    }
}

export default CartPage;