/**
 * Copyright © 2019 Elastic Path Software Inc. All rights reserved.
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
import Slider from 'react-slick';
import { withRouter } from 'react-router';
import { InlineShareButtons } from 'sharethis-reactjs';
import { login } from '../utils/AuthService';
import { itemLookup, cortexFetchItemLookupForm } from '../utils/CortexLookup';
import imgMissingHorizontal from '../../../app/src/images/img_missing_horizontal@2x.png';
import ProductRecommendationsDisplayMain from '../ProductRecommendations/productrecommendations.main';
import IndiRecommendationsDisplayMain from '../IndiRecommendations/indirecommendations.main';
import BundleConstituentsDisplayMain from '../BundleConstituents/bundleconstituents.main';
import { cortexFetch } from '../utils/Cortex';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

import './productdisplayitem.main.less';
import PowerReview from '../PowerReview/powerreview.main';

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
  'definition:components',
  'definition:components:element',
  'definition:components:element:code',
  'definition:components:element:standaloneitem',
  'definition:components:element:standaloneitem:code',
  'definition:components:element:standaloneitem:definition',
  'definition:components:element:standaloneitem:availability',
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

const multiCartZoomArray = [
  'carts',
  'carts:element',
  'carts:element:additemstocartform',
  'carts:element:descriptor',
];

let Config: IEpConfig | any = {};
let intl = { get: str => str };

interface ProductDisplayItemMainProps {
  productId: string,
  imageUrl?: string,
  dataSet?: { cartBtnOverride?: string },
  customClass?: string,
  onAddToCart?: (...args: any[]) => any,
  onAddToWishList?: (...args: any[]) => any,
  onChangeProductFeature?: (...args: any[]) => any,
  onReloadPage?: (...args: any[]) => any,
  productLink?: string,
  isInStandaloneMode?: boolean,
  itemDetailLink?: string,
  featuredProductAttribute?: boolean,
}

interface ProductDisplayItemMainState {
  productData: any,
  multiCartData: { [key: string]: any },
  itemQuantity: number,
  addToCartFailedMessage: string,
  isLoading: boolean,
  arFileExists: boolean,
  itemConfiguration: { [key: string]: any },
  selectionValue: string,
  addToCartLoading: boolean,
}

class ProductDisplayItemMain extends React.Component<ProductDisplayItemMainProps, ProductDisplayItemMainState> {
  static isLoggedIn(config) {
    return (localStorage.getItem(`${config.cortexApi.scope}_oAuthRole`) === 'REGISTERED');
  }

  static defaultProps = {
    imageUrl: undefined,
    dataSet: undefined,
    customClass: '',
    onAddToCart: () => {},
    onAddToWishList: () => {},
    onReloadPage: () => {},
    productLink: '',
    isInStandaloneMode: false,
    itemDetailLink: '',
    featuredProductAttribute: false,
  };

  private funcName: any;

  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    ({ intl } = epConfig);
    this.state = {
      productData: undefined,
      multiCartData: undefined,
      itemQuantity: 1,
      addToCartFailedMessage: '',
      isLoading: false,
      arFileExists: false,
      itemConfiguration: {},
      selectionValue: '',
      addToCartLoading: false,
    };

    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.handleSkuSelection = this.handleSkuSelection.bind(this);
    this.handleConfiguration = this.handleConfiguration.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.handleQuantityDecrement = this.handleQuantityDecrement.bind(this);
    this.handleQuantityIncrement = this.handleQuantityIncrement.bind(this);
    this.addToWishList = this.addToWishList.bind(this);
    this.renderProductImage = this.renderProductImage.bind(this);
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.dropdownCartSelection = this.dropdownCartSelection.bind(this);
    this.addToSelectedCart = this.addToSelectedCart.bind(this);
  }

  componentDidMount() {
    this.fetchMultiCartData();
    this.fetchProductData();
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
            });
          } else {
            this.setState({
              productData: res,
            });
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  fetchMultiCartData() {
    login().then(() => {
      cortexFetch(`?zoom=${multiCartZoomArray.sort().join()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(res => res.json())
        .then((res) => {
          this.setState({
            multiCartData: res,
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  fetchProductData() {
    const { productId } = this.props;

    login().then(() => {
      cortexFetchItemLookupForm()
        .then(() => itemLookup(productId, false)
          .then((res) => {
            if (Config.arKit.enable && document.createElement('a').relList.supports('ar')) {
              this.urlExists(Config.arKit.skuArImagesUrl.replace('%sku%', res._code[0].code), (exists) => {
                this.setState({
                  productData: res,
                  arFileExists: exists,
                });
              });
            } else {
              this.setState({
                productData: res,
              });
            }
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error.message);
          }));
    });
  }

  handleQuantityChange(event) {
    if (event.target.value === '') {
      this.setState({ itemQuantity: 1 });
    } else {
      this.setState({ itemQuantity: parseInt(event.target.value, 10) });
    }
  }

  handleQuantityDecrement() {
    const { itemQuantity } = this.state;
    if (itemQuantity > 1) {
      const newItemQuantity = itemQuantity - 1;
      this.setState({ itemQuantity: newItemQuantity });
    }
  }

  handleQuantityIncrement() {
    const { itemQuantity } = this.state;
    const newItemQuantity = itemQuantity + 1;
    this.setState({ itemQuantity: newItemQuantity });
  }

  handleConfiguration(configuration, event) {
    const { itemConfiguration } = this.state;
    itemConfiguration[configuration] = event.target.value;
    this.setState({ itemConfiguration });
  }

  handleSkuSelection(event) {
    const { onChangeProductFeature } = this.props;
    const selfUri = event.target.value;
    this.setState({
      isLoading: true,
    });
    login().then(() => {
      cortexFetch(`${selfUri}?followlocation=true&zoom=${zoomArray.sort().join()}`,
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
          onChangeProductFeature(res._code[0].code);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  addToCart(event) {
    const { productData, itemQuantity, itemConfiguration } = this.state;
    const { onAddToCart } = this.props;
    login().then(() => {
      const addToCartLink = productData._addtocartform[0].links.find(link => link.rel === 'addtodefaultcartaction');
      const body:any = {};
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
            onAddToCart();
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
    const { productData, itemQuantity, itemConfiguration } = this.state;
    const { onAddToWishList } = this.props;
    login().then(() => {
      const addToWishListLink = productData._addtowishlistform[0].links.find(link => link.rel === 'addtodefaultwishlistaction');
      const body:any = {};
      body.quantity = itemQuantity;
      if (itemConfiguration) {
        body.configuration = itemConfiguration;
      }
      cortexFetch(addToWishListLink.uri,
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
            onAddToWishList();
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
    fetch(url, {
      method: 'HEAD',
    }).then((res) => {
      callback(res.ok);
    });
  }

  handleSelectionChange(event) {
    this.setState({ selectionValue: event.target.value });
  }

  extractPrice(productData) {
    this.funcName = 'extractPrice';
    let listPrice = 'n/a';
    if (productData._price) {
      listPrice = productData._price[0]['list-price'][0].display;
    }
    let itemPrice = 'n/a';
    if (productData._price) {
      itemPrice = productData._price[0]['purchase-price'][0].display;
    }
    return { listPrice, itemPrice };
  }

  extractProductDetails(productData) {
    this.funcName = 'extractProductDetails';
    const productTitle = productData._definition[0]['display-name'];
    const productDescription = productData._definition[0].details ? (productData._definition[0].details.find(detail => detail['display-name'] === 'Summary' || detail['display-name'] === 'Description')) : '';
    const productDescriptionValue = productDescription !== undefined ? productDescription['display-value'] : '';
    const productImage = Config.skuImagesUrl.replace('%sku%', productData._code[0].code);
    return {
      productImage, productDescriptionValue, productTitle,
    };
  }

  extractAvailabilityParams(productData) {
    this.funcName = 'extractAvailabilityParams';
    let availability = (productData._addtocartform && productData._addtocartform[0].links.length > 0);
    let availabilityString = '';
    let productLink = '';
    if (productData._availability.length >= 0) {
      if (productData._code) {
        productLink = `${window.location.origin}/itemdetail/${productData._code[0].code}`;
      }
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
    return { availability, availabilityString, productLink };
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

  renderConfiguration() {
    const { productData, isLoading } = this.state;
    if (productData._addtocartform && productData._addtocartform[0].configuration) {
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

  renderSkuSelection() {
    const { productData, selectionValue } = this.state;
    const productKindsSelection = [];
    if (productData._definition[0]._options) {
      productData._definition[0]._options[0]._element.map((ChoiceElement, index) => {
        const arraySelectors = [];
        const selectorTitle = ChoiceElement['display-name'];
        const selectorWrap = ChoiceElement._selector[0]._choice;
        const chosenItem = ChoiceElement._selector[0]._chosen[0];
        if (selectorWrap) {
          selectorWrap.map(skuChoice => (
            arraySelectors.push(skuChoice)
          ));
        }
        arraySelectors.unshift(chosenItem);
        arraySelectors.sort((a, b) => {
          if (a._description[0]['display-name'] < b._description[0]['display-name']) {
            return -1;
          }
          if (a._description[0]['display-name'] > b._description[0]['display-name']) {
            return 1;
          }
          return 0;
        });
        productKindsSelection.push(arraySelectors);
        productKindsSelection[index].displayName = selectorTitle;
        productKindsSelection[index].defaultChousen = chosenItem._description[0]['display-name'];
        return productKindsSelection;
      });
      return (productKindsSelection.map(Component => (
        <fieldset onChange={this.handleSelectionChange} key={Math.random().toString(36).substr(2, 9)}>
          <span className="selector-title">
            {Component.displayName}
          </span>
          <div className="guide" id={`${(Component.displayName === 'Color') ? 'product_display_item_sku_guide' : 'product_display_item_size_guide'}`} onChange={this.handleSkuSelection}>
            {Component.map(Element => (
              <div key={Element._description[0]['display-name']} className={`select-wrap ${(Component.displayName === 'Color') ? 'color-wrap' : ''}`}>
                <input
                  key={Element._description[0].name}
                  type="radio"
                  name={Component.displayName}
                  id={`selectorWeight_${Element._description[0]['display-name'].toLowerCase().replace(/ /g, '_')}${productData._code[0].code}`}
                  value={(Element._selectaction) ? Element._selectaction[0].self.uri : ''}
                  defaultChecked={Element._description[0]['display-name'] === Component.defaultChousen || Element._selectaction[0].self.uri === selectionValue}
                />
                <label htmlFor={`selectorWeight_${Element._description[0]['display-name'].toLowerCase().replace(/ /g, '_')}${productData._code[0].code}`} style={{ background: Element._description[0]['display-name'] }}>
                  {Element._description[0]['display-name']}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      ))
      );
    }
    return null;
  }

  renderProductImage() {
    const { productData, arFileExists } = this.state;
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };
    if (arFileExists) {
      return (
        <a href={Config.arKit.skuArImagesUrl.replace('%sku%', productData._code[0].code)} rel="ar">
          <img
            src={Config.skuImagesUrl.replace('%sku%', productData._code[0].code)}
            onError={(e) => {
              const element: any = e.target;
              element.src = imgMissingHorizontal;
            }}
            alt={intl.get('none-available')}
            className="itemdetail-main-img"
          />
        </a>
      );
    }
    return (
      <div className="product-image-carousel">
        <Slider {...settings}>
          <div>
            <img src={Config.skuImagesUrl.replace('%sku%', productData._code[0].code)} onError={(e) => { const element: any = e.target; element.src = imgMissingHorizontal; }} alt={intl.get('none-available')} className="itemdetail-main-img" />
          </div>
        </Slider>
      </div>
    );
  }

  addToSelectedCart(cartUrl) {
    const { itemQuantity, productData } = this.state;
    const {
      onReloadPage,
    } = this.props;
    this.setState({ addToCartLoading: true });
    login().then(() => {
      const body: { [key: string]: any } = {};
      body.items = { code: productData._code[0].code, quantity: itemQuantity };
      cortexFetch(cartUrl,
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
            this.setState({ addToCartLoading: false });
            onReloadPage();
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
          this.setState({ addToCartLoading: false });
        });
    });
  }

  dropdownCartSelection() {
    const { multiCartData } = this.state;
    if (multiCartData && multiCartData._carts) {
      return (
        <ul className="cart-selection-dropdown">
          {multiCartData._carts[0]._element.map(cart => (
            // eslint-disable-next-line
            <li className="dropdown-item cart-selection-item" key={cart._descriptor[0].name ? cart._descriptor[0].name : intl.get('default')} onClick={() => this.addToSelectedCart(cart._additemstocartform[0].self.uri)}>
              {cart._descriptor[0].name ? cart._descriptor[0].name : intl.get('default')}
            </li>
          ))}
        </ul>
      );
    }
    return null;
  }

  render() {
    const {
      productData, addToCartFailedMessage, isLoading, itemQuantity, multiCartData, addToCartLoading,
    } = this.state;
    const { featuredProductAttribute, itemDetailLink } = this.props;
    if (productData) {
      const { listPrice, itemPrice } = this.extractPrice(productData);

      const { availability, availabilityString, productLink } = this.extractAvailabilityParams(productData);

      const {
        productImage, productDescriptionValue, productTitle,
      } = this.extractProductDetails(productData);
      // Set the language-specific configuration for indi integration
      Config.indi.productReview.title = intl.get('indi-product-review-title');
      Config.indi.productReview.description = intl.get('indi-product-review-description');
      Config.indi.productReview.submit_button_text = intl.get('indi-product-review-submit-button-text');
      return (
        <div className="itemdetail-component container-3">
          <div>
            <div className="itemdetail-assets">
              <div data-region="itemDetailAssetRegion" style={{ display: 'block' }}>
                <div className="itemdetail-asset-container">
                  {(featuredProductAttribute)
                    ? (
                      <div className="featured">
                        {intl.get('featured')}
                      </div>
                    )
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
                  {(Config.b2b.enable) && (
                    <h4 className="itemdetail-title-sku" id={`category_item_sku_${productData._code[0].code}`}>
                      {productData._code[0].code}
                    </h4>
                  )}
                </div>
              </div>
              <div className="itemdetail-price-container itemdetail-price-wrap" data-region="itemDetailPriceRegion" style={{ display: 'block' }}>
                <div>
                  <div data-region="itemPriceRegion" style={{ display: 'block' }}>
                    <ul className="itemdetail-price-container">
                      {
                        listPrice !== itemPrice
                          ? (
                            <li className="itemdetail-purchase-price">
                              <h1 className="itemdetail-purchase-price-value price-sale" id={`category_item_price_${productData._code[0].code}`}>
                                {itemPrice}
                              </h1>
                              <span className="itemdetail-list-price-value" data-region="itemListPriceRegion" id={`category_item_list_price_${productData._code[0].code}`}>
                                {listPrice}
                              </span>
                            </li>
                          )
                          : (
                            <li className="itemdetail-purchase-price">
                              <h1 className="itemdetail-purchase-price-value" id={`category_item_price_${productData._code[0].code}`}>
                                {itemPrice}
                              </h1>
                            </li>
                          )
                      }
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
                      {intl.get('expected-release-date')}
                      :&nbsp;
                    </label>
                    <span className="itemdetail-release-date-value" id={`category_item_release_date_${productData._code[0].code}`}>
                      {productData._availability[0]['release-date'] ? productData._availability[0]['release-date']['display-value'] : ''}
                    </span>
                  </li>
                </ul>
              </div>
              <div className="itemdetail-addtocart" data-region="itemDetailAddToCartRegion" style={{ display: 'block' }}>
                <div>
                  <form className="itemdetail-addtocart-form form-horizontal" onSubmit={(event) => { if (multiCartData && multiCartData._carts) { event.preventDefault(); } else { this.addToCart(event); } }}>
                    {this.renderConfiguration()}
                    {this.renderSkuSelection()}
                    <div className="form-group">
                      <label htmlFor="product_display_item_quantity_label" className="control-label">
                        {intl.get('quantity')}
                      </label>
                      <div className="input-group-btn">
                        <button type="button" className="quantity-left-minus btn btn-number" data-type="minus" data-field="" onClick={this.handleQuantityDecrement}>
                          <span className="glyphicon glyphicon-minus" />
                        </button>
                        <div className="quantity-col form-content form-content-quantity">
                          <input id="product_display_quantity_field" className="product-display-item-quantity-select form-control form-control-quantity" type="number" step="1" min="1" max="9999" value={itemQuantity} onChange={this.handleQuantityChange} />
                        </div>
                        <button type="button" className="quantity-right-plus btn btn-number" data-type="plus" data-field="" onClick={this.handleQuantityIncrement}>
                          <span className="glyphicon glyphicon-plus" />
                        </button>
                      </div>
                      {
                        (isLoading) ? (<div className="miniLoader" />) : ''
                      }
                    </div>
                    <div className="form-group-submit">
                      {multiCartData && multiCartData._carts ? (
                        <div className="form-content form-content-submit col-sm-offset-4 dropdown">
                          <button
                            className="ep-btn primary wide btn-itemdetail-addtocart dropdown-toggle"
                            data-toggle="dropdown"
                            disabled={!availability || !productData._addtocartform}
                            id="product_display_item_add_to_cart_button"
                            type="submit"
                          >
                            {addToCartLoading ? (
                              <span className="miniLoader" />
                            ) : (
                              <span>
                                {intl.get('add-to-cart')}
                              </span>
                            )}
                          </button>
                          <div className="dropdown-menu cart-selection-list">
                            {this.dropdownCartSelection()}
                          </div>
                        </div>
                      ) : (
                        <div className="form-content form-content-submit col-sm-offset-4">
                          <button
                            className="ep-btn primary wide btn-itemdetail-addtocart"
                            disabled={!availability || !productData._addtocartform}
                            id="product_display_item_add_to_cart_button"
                            type="submit"
                          >
                            <span>
                              {intl.get('add-to-cart')}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="auth-feedback-container" id="product_display_item_add_to_cart_feedback_container" data-i18n="">
                      {addToCartFailedMessage}
                    </div>
                  </form>
                  {(ProductDisplayItemMain.isLoggedIn(Config) && productData._addtocartform && !(Object.keys(productData._addtocartform[0].configuration).length > 0)) ? (
                    <form className="itemdetail-addtowishlist-form form-horizontal">
                      <div className="form-group-submit">
                        <div className="form-content form-content-submit col-sm-offset-4">
                          <button
                            onClick={this.addToWishList}
                            className="ep-btn wide btn-itemdetail-addtowishlist"
                            disabled={!availability || !productData._addtowishlistform}
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
                <div className="social-network-sharing">
                  <InlineShareButtons
                    config={{
                      alignment: 'center', // alignment of buttons (left, center, right)
                      color: 'social', // set the color of buttons (social, white)
                      enabled: true, // show/hide buttons (true, false)
                      font_size: 16, // font size for the buttons
                      labels: 'cta', // button labels (cta, counts, null)
                      language: 'en', // which language to use (see LANGUAGES)
                      networks: [ // which networks to include (see SHARING NETWORKS)
                        'facebook',
                        'twitter',
                        'pinterest',
                        'email',
                      ],
                      padding: 12, // padding within buttons (INTEGER)
                      radius: 4, // the corner radius on each button (INTEGER)
                      size: 40, // the size of each button (INTEGER)

                      // OPTIONAL PARAMETERS
                      url: productLink, // (defaults to current url)
                      image: productImage, // (defaults to og:image or twitter:image)
                      description: productDescriptionValue, // (defaults to og:description or twitter:description)
                      title: productTitle, // (defaults to og:title or twitter:title)
                      message: 'custom email text', // (only for email sharing)
                      subject: 'custom email subject', // (only for email sharing)
                      username: 'custom twitter handle', // (only for twitter sharing)
                    }}
                  />
                </div>
              </div>
              <PowerReview productData={productData} />
              <div className="itemdetail-tabs-wrap">
                {(Config.PowerReviews.enable) ? (
                  <ul className="nav nav-tabs itemdetail-tabs" role="tablist">
                    <li className="nav-item">
                      <a className="nav-link active" id="summary-tab" data-toggle="tab" href="#summary" role="tab" aria-selected="true">
                        {intl.get('summary')}
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" id="reviews-tab" data-toggle="tab" href="#reviews" role="tab" aria-selected="false">
                        {intl.get('reviews')}
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" id="questions-tab" data-toggle="tab" href="#questions" role="tab" aria-selected="false">
                        {intl.get('questions')}
                      </a>
                    </li>
                  </ul>
                ) : ('')
                }
                <div className="tab-content">
                  <div className="tab-pane fade show active" id="summary" role="tabpanel" aria-labelledby="summary-tab">
                    <div className="itemDetailAttributeRegion" data-region="itemDetailAttributeRegion">
                      {this.renderAttributes()}
                    </div>
                  </div>
                  <div className="tab-pane fade" id="reviews" role="tabpanel" aria-labelledby="reviews-tab">
                    <div id="pr-reviewdisplay" />
                  </div>
                  <div className="tab-pane fade" id="questions" role="tabpanel" aria-labelledby="questions-tab">
                    <div id="pr-questiondisplay" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <BundleConstituentsDisplayMain productData={productData} itemDetailLink={itemDetailLink} />
          <ProductRecommendationsDisplayMain productData={productData} itemDetailLink={itemDetailLink} />
          <IndiRecommendationsDisplayMain render={['carousel', 'product']} configuration={Config.indi} keywords={productData._code[0].code} />
        </div>
      );
    }

    return (<div className="loader" />);
  }
}

export default withRouter(ProductDisplayItemMain);
