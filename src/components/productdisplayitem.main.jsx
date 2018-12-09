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
import ReactRouterPropTypes from 'react-router-prop-types';
import intl from 'react-intl-universal';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { login } from '../utils/AuthService';
import { itemLookup, cortexFetchItemLookupForm } from '../utils/CortexLookup';
import {
  isAnalyticsConfigured, trackAddItemAnalytics, trackAddImpression, setAddAnalytics, sendAddToCartAnalytics, setDetailAnalytics,
} from '../utils/Analytics';
import imgPlaceholder from '../images/img-placeholder.png';
import ProductRecommendationsDisplayMain from './productrecommendations.main';
import IndiRecommendationsDisplayMain from './indirecommendations.main';
import cortexFetch from '../utils/Cortex';

import './productdisplayitem.main.less';

const Config = require('Config');

// Array of zoom parameters to pass to Cortex
const zoomArray = [
  'availability',
  'addtocartform',
  'addtowishlistform',
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
  'recommendations:crosssell:element:code',
  'recommendations:recommendation:element:code',
  'recommendations:replacement:element:code',
  'recommendations:upsell:element:code',
  'recommendations:warranty:element:code',
  'recommendations:crosssell:element:definition',
  'recommendations:recommendation:element:definition',
  'recommendations:replacement:element:definition',
  'recommendations:upsell:element:definition',
  'recommendations:warranty:element:definition',
  'recommendations:crosssell:element:price',
  'recommendations:recommendation:element:price',
  'recommendations:replacement:element:price',
  'recommendations:upsell:element:price',
  'recommendations:warranty:element:price',
  'recommendations:crosssell:element:availability',
  'recommendations:recommendation:element:availability',
  'recommendations:replacement:element:availability',
  'recommendations:upsell:element:availability',
  'recommendations:warranty:element:availability',
  'code',
];

class ProductDisplayItemMain extends React.Component {
  static isLoggedIn() {
    return (localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) === 'REGISTERED');
  }

  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    productId: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      productData: undefined,
      itemQuantity: 1,
      addToCartFailedMessage: '',
      isLoading: false,
      arFileExists: false,
      itemConfiguration: {},
    };
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.handleSkuSelection = this.handleSkuSelection.bind(this);
    this.handleConfiguration = this.handleConfiguration.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.addToWishList = this.addToWishList.bind(this);
    this.renderProductImage = this.renderProductImage.bind(this);
  }

  componentDidMount() {
    const { productId } = this.props;
    login().then(() => {
      cortexFetchItemLookupForm()
        .then(() => itemLookup(productId)
          .then((res) => {
            if (Config.arKit.enable) {
              this.urlExists(Config.arKit.skuArImagesUrl.replace('%sku%', res._code[0].code), (exists) => {
                this.setState({
                  productData: res,
                  arFileExists: exists,
                });
                this.trackImpressionAnalytics();
              });
            } else {
              this.setState({
                productData: res,
              });
              this.trackImpressionAnalytics();
            }
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error.message);
          }));
    });
  }

  componentWillReceiveProps(nextProps) {
    login().then(() => {
      itemLookup(nextProps.productId)
        .then((res) => {
          if (Config.arKit.enable) {
            this.urlExists(Config.arKit.skuArImagesUrl.replace('%sku%', res._code[0].code), (exists) => {
              this.setState({
                productData: res,
                arFileExists: exists,
              });
              this.trackImpressionAnalytics();
            });
          } else {
            this.setState({
              productData: res,
            });
            this.trackImpressionAnalytics();
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  trackImpressionAnalytics() {
    if (isAnalyticsConfigured()) {
      const { productData, itemQuantity } = this.state;
      const categoryTag = (productData._definition[0].details) ? (productData._definition[0].details.find(detail => detail['display-name'] === 'Tag')) : '';
      trackAddImpression(productData._definition[0]['display-name'], productData._code[0].code, productData._price[0]['purchase-price'][0].display, (categoryTag !== undefined && categoryTag !== '') ? categoryTag['display-value'] : '', itemQuantity);
      setDetailAnalytics();
    }
  }

  handleQuantityChange(event) {
    this.setState({ itemQuantity: parseInt(event.target.value, 10) });
  }

  handleConfiguration(configuration, event) {
    const { itemConfiguration } = this.state;
    itemConfiguration[configuration] = event.target.value;
    this.setState({ itemConfiguration });
  }

  handleSkuSelection(event) {
    const selfUri = event.target.value;
    const { history } = this.props;
    this.setState({
      isLoading: true,
    });
    login().then(() => {
      cortexFetch(`${selfUri}?followlocation&zoom=${zoomArray.sort().join()}`,
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
          history.push(`/itemdetail/${encodeURIComponent(res._code[0].code)}`);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  addToCart(event) {
    const { productData, itemQuantity, itemConfiguration } = this.state;
    const { history } = this.props;
    login().then(() => {
      const addToCartLink = productData._addtocartform[0].links.find(link => link.rel === 'addtodefaultcartaction');
      const body = {};
      body.quantity = itemQuantity;
      if (itemConfiguration) {
        body.configuration = itemConfiguration;
      }
      cortexFetch(addToCartLink.uri,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
          body: JSON.stringify(body),
        })
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            if (isAnalyticsConfigured()) {
              const categoryTag = (productData._definition[0].details) ? (productData._definition[0].details.find(detail => detail['display-name'] === 'Tag')) : '';
              trackAddItemAnalytics(productData.self.uri.split(`/items/${Config.cortexApi.scope}/`)[1], productData._definition[0]['display-name'], productData._code[0].code, productData._price[0]['purchase-price'][0].display, (categoryTag !== undefined && categoryTag !== '') ? categoryTag['display-value'] : '', itemQuantity);
              setAddAnalytics();
              sendAddToCartAnalytics();
            }
            history.push('/mybag');
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
          console.error(error.message);
        });
    });
    event.preventDefault();
  }

  addToWishList(event) {
    const { productData, itemQuantity } = this.state;
    const { history } = this.props;
    login().then(() => {
      const addToWishListLink = productData._addtowishlistform[0].links.find(link => link.rel === 'addtodefaultwishlistaction');
      cortexFetch(addToWishListLink.uri,
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
            history.push('/wishlists');
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
          console.error(error.message);
        });
    });
    event.preventDefault();
  }

  urlExists(url, callback) {
    this.funcName = 'UrlExists';
    fetch(url)
      .then((res) => {
        callback(res.ok);
      });
  }

  renderAttributes() {
    const { productData } = this.state;
    if (productData._definition[0].details) {
      return productData._definition[0].details.map(attribute => (
        <ul className="itemdetail-attribute" key={attribute.name}>
          <li className="itemdetail-attribute-label-col">
            {attribute['display-name']}
          </li>
          <li className="itemdetail-attribute-value-col">
            {attribute['display-value']}
          </li>
        </ul>
      ));
    }
    return null;
  }

  renderSkuSelection() {
    const { productData, isLoading } = this.state;
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

  renderConfiguration() {
    const { productData, isLoading } = this.state;
    if (productData._addtocartform[0].configuration) {
      const keys = Object.keys(productData._addtocartform[0].configuration);
      return keys.map(key => (
        <div key={key} className="form-group">
          <label htmlFor={`product_display_item_configuration_${key}_label`} className="control-label">
            {key}
          </label>
          <div className="form-content">
            <input className="form-control form-control-text" disabled={isLoading} onChange={e => this.handleConfiguration(key, e)} id={`product_display_item_configuration_${key}_label`} value={productData._addtocartform[0].configuration.key} />
          </div>
        </div>
      ));
    }
    return null;
  }

  renderProductImage() {
    const { productData, arFileExists } = this.state;
    const arBrowserSupported = document.createElement('a');
    const isInStandaloneMode = window.navigator.standalone;
    if (arBrowserSupported.relList.supports('ar') && !isInStandaloneMode && arFileExists) {
      return (
        <a href={Config.arKit.skuArImagesUrl.replace('%sku%', productData._code[0].code)} rel="ar">
          <img src={Config.skuImagesUrl.replace('%sku%', productData._code[0].code)} onError={(e) => { e.target.src = imgPlaceholder; }} alt={intl.get('none-available')} className="itemdetail-main-img" />
        </a>
      );
    }
    return (
      <img src={Config.skuImagesUrl.replace('%sku%', productData._code[0].code)} onError={(e) => { e.target.src = imgPlaceholder; }} alt={intl.get('none-available')} className="itemdetail-main-img" />
    );
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
          availabilityString = intl.get('in-stock');
        } else if (productData._availability[0].state === 'AVAILABLE_FOR_PRE_ORDER') {
          availabilityString = intl.get('pre-order');
        } else if (productData._availability[0].state === 'AVAILABLE_FOR_BACK_ORDER') {
          availability = true;
          availabilityString = intl.get('back-order');
        } else {
          availabilityString = intl.get('out-of-stock');
        }
      }
      const featuredProductAttribute = (productData._definition[0].details) ? (productData._definition[0].details.find(detail => detail['display-name'] === 'Featured')) : '';
      return (
        <div className="itemdetail-component container-3">
          <div className="itemdetail-assets">
            <div data-region="itemDetailAssetRegion" style={{ display: 'block' }}>
              <div className="itemdetail-asset-container">
                {(featuredProductAttribute !== undefined && featuredProductAttribute !== '')
                  ? (
                    <div className="featured">
                      {intl.get('featured')}
                    </div>)
                  : ('')
                }
                {this.renderProductImage()}
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
                              {intl.get('original-price')}
                              &nbsp;
                            </label>
                            <span className="itemdetail-list-price-value" id={`category_item_list_price_${productData._code[0].code}`}>
                              {listPrice}
                            </span>
                          </li>
                        )
                        : ('')
                    }
                    <li className="itemdetail-purchase-price">
                      <h1 className="itemdetail-purchase-price-value" id={`category_item_price_${productData._code[0].code}`}>
                        {itemPrice}
                      </h1>
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
                        <span className="icon glyphicon glyphicon-ok" />
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
                    {intl.get('expected-release-date')}
                    :&nbsp;
                  </label>
                  <span className="itemdetail-release-date-value" id={`category_item_release_date_${productData._code[0].code}`}>
                    {productData._availability[0]['release-date'] ? productData._availability[0]['release-date']['display-value'] : ''}
                  </span>
                </li>
              </ul>
            </div>
            <hr />
            <div className="itemdetail-addtocart" data-region="itemDetailAddToCartRegion" style={{ display: 'block' }}>
              <div>
                <form className="itemdetail-addtocart-form form-horizontal" onSubmit={this.addToCart}>
                  {this.renderSkuSelection()}
                  {this.renderConfiguration()}
                  <div className="form-group">
                    <label htmlFor="product_display_item_quantity_label" className="control-label">
                      {intl.get('quantity')}
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
                    {
                      (isLoading) ? (<div className="miniLoader" />) : ''
                    }
                  </div>
                  <div className="form-group-submit">
                    <div className="form-content form-content-submit col-sm-offset-4">
                      <button
                        className="ep-btn primary wide btn-itemdetail-addtocart"
                        disabled={!availability}
                        id="product_display_item_add_to_cart_button"
                        type="submit"
                      >
                        {intl.get('add-to-cart')}
                      </button>
                    </div>
                  </div>

                  <div className="auth-feedback-container" id="product_display_item_add_to_cart_feedback_container" data-i18n="">
                    {addToCartFailedMessage}
                  </div>

                </form>
                {(ProductDisplayItemMain.isLoggedIn()) ? (
                  <form className="itemdetail-addtowishlist-form form-horizontal" onSubmit={this.addToWishList}>
                    <div className="form-group-submit">
                      <div className="form-content form-content-submit col-sm-offset-4">
                        <button
                          className="ep-btn wide btn-itemdetail-addtowishlist"
                          disabled={!availability}
                          id="product_display_item_add_to_wish_list_button"
                          type="submit"
                        >
                          {intl.get('add-to-wish-list')}
                        </button>
                      </div>
                    </div>
                  </form>
                ) : ('')
                }
              </div>
            </div>
            <div className="itemDetailAttributeRegion" data-region="itemDetailAttributeRegion" style={{ display: 'block' }}>
              {this.renderAttributes()}
            </div>
          </div>
          <ProductRecommendationsDisplayMain productData={productData} />
          <IndiRecommendationsDisplayMain productData={productData} />
        </div>
      );
    }

    return (<div className="loader" />);
  }
}

export default withRouter(ProductDisplayItemMain);
