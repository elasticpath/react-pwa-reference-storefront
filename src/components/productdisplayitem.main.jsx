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
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { login } from '../utils/AuthService';
import imgPlaceholder from '../images/img-placeholder.png';
import ProductRecommendationsDisplayMain from './productrecommendations.main';
import cortexFetch from '../utils/Cortex';

const Config = require('Config');

// Array of zoom parameters to pass to Cortex
const zoomArray = [
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
  'recommendations',
  'recommendations:crosssell',
  'recommendations:recommendation',
  'recommendations:replacement',
  'recommendations:upsell',
  'recommendations:warranty',
  'code',
];

class ProductDisplayItemMain extends React.Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    productUrl: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      productData: undefined,
      itemQuantity: 1,
      addToCartFailedMessage: '',
      isLoading: false,
    };
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.handleSkuSelection = this.handleSkuSelection.bind(this);
    this.addToCart = this.addToCart.bind(this);
  }

  componentDidMount() {
    const { productUrl } = this.props;
    login().then(() => {
      cortexFetch(Config.cortexApi.path + productUrl,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
        .then(res => res.json())
        .then((res) => {
          this.setState({
            productData: res,
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    });
  }

  componentWillReceiveProps(nextProps) {
    login().then(() => {
      cortexFetch(Config.cortexApi.path + nextProps.productUrl,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
        .then(res => res.json())
        .then((res) => {
          this.setState({
            productData: res,
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    });
  }

  handleQuantityChange(event) {
    this.setState({ itemQuantity: parseInt(event.target.value, 10) });
  }

  handleSkuSelection(event) {
    const selfUri = event.target.value;
    const { history } = this.props;
    this.setState({
      isLoading: true,
    });
    login().then(() => {
      cortexFetch(`${Config.cortexApi.path + selfUri}?followlocation&zoom=${zoomArray.sort().join()}`,
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
          history.push(`/itemdetail/${encodeURIComponent(res.self.uri)}`);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    });
  }

  addToCart(event) {
    const { productData, itemQuantity } = this.state;
    const { history } = this.props;
    login().then(() => {
      const addToCartLink = productData._addtocartform[0].links.find(link => link.rel === 'addtodefaultcartaction');
      cortexFetch(addToCartLink.href,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
          body: JSON.stringify({
            quantity: itemQuantity,
          }),
        })
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            history.push('/mycart');
          } else {
            let debugMessages = '';
            res.json().then((json) => {
              for (let i = 0; i < json.messages.length; i++) {
                debugMessages = debugMessages.concat(`- ${json.messages[i]['debug-message']} \n `);
              }
            }).then(() => this.setState({ addToCartFailedMessage: debugMessages }));
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    });
    event.preventDefault();
  }

  renderSkuSelection() {
    const { productData } = this.state;
    if (productData._definition[0]._options) {
      return productData._definition[0]._options[0]._element.map(options => (
        <div key={options.name} className="form-group">
          <label htmlFor={`product_display_item_sku_${options.name}_label`} className="control-label">
            {options['display-name']}
          </label>
          <div className="form-content">
            <select className="form-control" id={`product_display_item_sku_select_${options.name}`} disabled={isLoading} name="itemdetail-select-sku" onChange={this.handleSkuSelection}>
              <option key={options._selector[0]._chosen[0]._description[0].name} id={`product_display_item_sku_option_${options._selector[0]._chosen[0]._description[0].name}`} value={(options._selector[0]._chosen[0]._selectaction) ? options._selector[0]._chosen[0]._selectaction[0].self.uri : ''}>
                {options._selector[0]._chosen[0]._description[0]['display-name']}
              </option>
              {(options._selector[0]._choice) ? options._selector[0]._choice.map(skuChoice => (
                <option key={skuChoice._description[0].name} id={`product_display_item_sku_option_${skuChoice._description[0].name}`} value={(skuChoice._selectaction) ? skuChoice._selectaction[0].self.uri : ''}>
                  {skuChoice._description[0]['display-name']}
                </option>
              )) : ''}
            </select>
          </div>
        </div>
      ));
    }
    return null;
  }

  renderAttributes() {
    const { productData } = this.state;
    if (productData._definition[0].details) {
      return productData._definition[0].details.map(attribute => (
        <tr key={attribute.name}>
          <td className="itemdetail-attribute-label-col">
            {attribute['display-name']}
          </td>
          <td className="itemdetail-attribute-value-col">
            {attribute['display-value']}
          </td>
        </tr>
      ));
    }
    return null;
  }

  render() {
    const { productData, addToCartFailedMessage, isLoading } = this.state;
    if (productData) {
      let listPrice = 'n/a';
      if (productData._price) {
        listPrice = productData._price[0]['list-price'][0].display;
      }
      let itemPrice = 'n/a';
      if (productData._price) {
        itemPrice = productData._price[0]['purchase-price'][0].display;
      }
      let availability = (productData._addtocartform[0].links.length > 0);
      let availabilityString = '';
      if (productData._availability.length >= 0) {
        if (productData._availability[0].state === 'AVAILABLE') {
          availabilityString = 'In Stock';
        } else if (productData._availability[0].state === 'AVAILABLE_FOR_PRE_ORDER') {
          availabilityString = 'Pre-order';
        } else if (productData._availability[0].state === 'AVAILABLE_FOR_BACK_ORDER') {
          availability = true;
          availabilityString = 'Back-order';
        } else {
          availabilityString = 'Out of Stock';
        }
      }
      return (
        <div className="container">
          <div className="itemdetail-container row">

            <div className="itemdetail-assets">
              <div data-region="itemDetailAssetRegion" style={{ display: 'block' }}>
                <div className="itemdetail-asset-container">
                  <img src={Config.skuImagesS3Url.replace('%sku%', productData._code[0].code)} onError={(e) => { e.target.src = imgPlaceholder; }} alt="None Available" className="itemdetail-main-img" />
                </div>
              </div>
            </div>

            <div className="itemdetail-details">
              <div data-region="itemDetailTitleRegion" style={{ display: 'block' }}>
                <div>
                  <h1 className="itemdetail-title" id={`category_item_title_${productData._code[0].code}`}>
                    {productData._definition[0]['display-name']}
                  </h1>
                </div>
              </div>
              <div className="itemdetail-price-container" data-region="itemDetailPriceRegion" style={{ display: 'block' }}>
                <div>
                  <div data-region="itemPriceRegion" style={{ display: 'block' }}>
                    <ul className="itemdetail-price-container">
                      {
                        listPrice !== itemPrice
                          ? (
                            <li className="itemdetail-list-price" data-region="itemListPriceRegion">
                              <label htmlFor={`category_item_list_price_${productData._code[0].code}_label`} className="itemdetail-list-price-label">
                                Original Price&nbsp;
                              </label>
                              <span className="itemdetail-list-price-value" id={`category_item_list_price_${productData._code[0].code}`}>
                                {listPrice}
                              </span>
                            </li>
                          )
                          : ('')
                      }
                      <li className="itemdetail-purchase-price">
                        <label htmlFor={`category_item_price_${productData._code[0].code}_label`} className="itemdetail-purchase-price-label">
                          Price&nbsp;
                        </label>
                        <span className="itemdetail-purchase-price-value" id={`category_item_price_${productData._code[0].code}`}>
                          {itemPrice}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div data-region="itemRateRegion" />
                </div>
              </div>
              <div data-region="itemDetailAvailabilityRegion" style={{ display: 'block' }}>
                <ul className="itemdetail-availability-container">
                  <li className="itemdetail-availability itemdetail-availability-state" data-i18n="AVAILABLE">
                    <label htmlFor={`category_item_availability_${productData._code[0].code}`}>
                      {(availability) ? (
                        <div>
                          <span className="icon" />
                          {availabilityString}
                        </div>
                      ) : (
                        <div>
                          {availabilityString}
                        </div>
                      )}
                    </label>
                  </li>
                  <li className={`itemdetail-release-date${productData._availability[0]['release-date'] ? '' : ' is-hidden'}`} data-region="itemAvailabilityDescriptionRegion">
                    <label htmlFor={`category_item_release_date_${productData._code[0].code}_label`} className="itemdetail-release-date-label">
                      Expected Release Date:&nbsp;
                    </label>
                    <span className="itemdetail-release-date-value" id={`category_item_release_date_${productData._code[0].code}`}>
                      {productData._availability[0]['release-date'] ? productData._availability[0]['release-date']['display-value'] : ''}
                    </span>
                  </li>
                </ul>
              </div>
              <div data-region="itemDetailAttributeRegion" style={{ display: 'block' }}>
                <table className="table table-striped table-condensed">
                  <tbody>
                    {this.renderAttributes()}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="itemdetail-addtocart col-xs-12 col-sm-10 col-md-6 col-lg-3">
              <div data-region="itemDetailAddToCartRegion" style={{ display: 'block' }}>
                <div>
                  <form className="itemdetail-addtocart-form form-horizontal" onSubmit={this.addToCart}>
                    {this.renderSkuSelection()}
                    {
                      (isLoading) ? (<div className="miniLoader" />) : ''
                    }
                    <div className="form-group">
                      <label htmlFor="product_display_item_quantity_label" className="control-label">
                        Quantity
                      </label>

                      <div className="form-content">
                        <select className="form-control" id="product_display_item_quantity_select" name="itemdetail-select-quantity" onChange={this.handleQuantityChange}>
                          <option id="product_display_item_quantity_option_1" value="1">
                            1
                          </option>
                          <option id="product_display_item_quantity_option_2" value="2">
                            2
                          </option>
                          <option id="product_display_item_quantity_option_3" value="3">
                            3
                          </option>
                          <option id="product_display_item_quantity_option_4" value="4">
                            4
                          </option>
                          <option id="product_display_item_quantity_option_5" value="5">
                            5
                          </option>
                          <option id="product_display_item_quantity_option_6" value="6">
                            6
                          </option>
                          <option id="product_display_item_quantity_option_7" value="7">
                            7
                          </option>
                          <option id="product_display_item_quantity_option_8" value="8">
                            8
                          </option>
                          <option id="product_display_item_quantity_option_9" value="9">
                            9
                          </option>
                          <option id="product_display_item_quantity_option_10" value="10">
                            10
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group form-group-submit">
                      <div className="form-content form-content-submit col-sm-8 col-sm-offset-4">
                        <button className={`btn-round btn btn-primary btn-itemdetail-addtocart${!availability ? ' disabled' : ''}`} id="product_display_item_add_to_cart_button" type="submit">
                          Add to Cart
                        </button>
                      </div>
                    </div>

                    <div className="auth-feedback-container" id="product_display_item_add_to_cart_feedback_container" data-i18n="">
                      {addToCartFailedMessage}
                    </div>

                  </form>
                </div>
              </div>
            </div>
          </div>
          <ProductRecommendationsDisplayMain productData={productData} />
        </div>
      );
    }

    return (<div className="loader" />);
  }
}

export default withRouter(ProductDisplayItemMain);
