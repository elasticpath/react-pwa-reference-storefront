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

import React, { Component } from 'react';
import Slider from 'react-slick';
import { login } from '../utils/AuthService';
import { itemLookup, cortexFetchItemLookupForm } from '../utils/CortexLookup';
import transparentImg from '../../../images/icons/transparent.png';
import ProductRecommendationsDisplayMain from '../ProductRecommendations/productrecommendations.main';
import IndiRecommendationsDisplayMain from '../IndiRecommendations/indirecommendations.main';
import BundleConstituentsDisplayMain from '../BundleConstituents/bundleconstituents.main';
import DropdownCartSelection from '../DropdownCartSelection/dropdown.cart.selection.main';
import { cortexFetch } from '../utils/Cortex';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import VRProductDisplayItem from '../VRProductDisplayItem/VRProductDisplayItem';
import ProductPriceContainer from '../ProductPriceContainer/productPriceContainer';
import PowerReview from '../PowerReview/powerreview.main';
import ImageContainer from '../ImageContainer/image.container';
import ProductSocialNetworkSharing from '../ProductSocialNetworkSharing/productSocialNetworkSharing';
import ProductAttributesContainer from '../ProductAttributesContainer/productAttributesContainer';
import ProductRequisitionListButton from '../ProductRequisitionListButton/productRequisitionListButton';
import ProductQuantityPicker from '../ProductQuantityPicker/productQuantityPicker';

import './productdisplayitem.main.less';

// Array of zoom parameters to pass to Cortex
const zoomArray = [
  'availability',
  'addtocartform',
  'addtocartforms:element:addtocartaction',
  'addtocartforms:element:target:descriptor',
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

const requisitionListsZoomArray = [
  'itemlistinfo',
  'itemlistinfo:allitemlists',
  'itemlistinfo:allitemlists:element',
  'itemlistinfo:allitemlists:element:additemstoitemlistform',
];

let Config: IEpConfig | any = {};
let intl = { get: str => str };

interface ProductDisplayItemMainProps {
  /** product id */
  productId: string,
  /** image url */
  imageUrl?: string,
  /** data set */
  dataSet?: { cartBtnOverride?: string },
  /** handle add to cart */
  onAddToCart?: (...args: any[]) => any,
  /** handle add to wishlist */
  onAddToWishList?: (...args: any[]) => any,
  /** handle add to requisition list */
  onRequisitionPage?: (...args: any[]) => any,
  /** handle change product feature */
  onChangeProductFeature?: (...args: any[]) => any,
  /** handle reload page */
  onReloadPage?: (...args: any[]) => any,
  /** product link */
  productLink?: string,
  /** is in standalone mode */
  isInStandaloneMode?: boolean,
  /** item detail link */
  itemDetailLink?: string,
  /** featured product attribute */
  featuredProductAttribute?: boolean,
}

interface ProductDisplayItemMainState {
  productId: any,
  productData: any,
  requisitionListData: any,
  itemQuantity: number,
  isLoading: boolean,
  arFileExists: boolean,
  vrFileExists: boolean,
  itemConfiguration: { [key: string]: any },
  selectionValue: string,
  addToCartLoading: boolean,
  detailsProductData: any,
  vrMode: boolean;
  multiImages: any,
}

class ProductDisplayItemMain extends Component<ProductDisplayItemMainProps, ProductDisplayItemMainState> {
  static isLoggedIn(config) {
    return (localStorage.getItem(`${config.cortexApi.scope}_oAuthRole`) === 'REGISTERED');
  }

  static async urlExists(url) {
    const res = await fetch(url, {
      method: 'HEAD',
    });

    if (res.status === 200) {
      return true;
    }

    return false;
  }

  static defaultProps = {
    imageUrl: undefined,
    dataSet: undefined,
    onAddToCart: () => {},
    onAddToWishList: () => {},
    onRequisitionPage: () => {},
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
      productId: '',
      productData: undefined,
      itemQuantity: 1,
      isLoading: false,
      arFileExists: false,
      vrFileExists: false,
      itemConfiguration: {},
      selectionValue: '',
      addToCartLoading: false,
      detailsProductData: [],
      requisitionListData: undefined,
      vrMode: false,
      multiImages: [],
    };

    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.handleSkuSelection = this.handleSkuSelection.bind(this);
    this.handleConfiguration = this.handleConfiguration.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.addToWishList = this.addToWishList.bind(this);
    this.renderProductImage = this.renderProductImage.bind(this);
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.addToSelectedCart = this.addToSelectedCart.bind(this);
    this.initVR = this.initVR.bind(this);
    this.closeVR = this.closeVR.bind(this);
    this.getVRBackgroundImg = this.getVRBackgroundImg.bind(this);
    this.handleArLinkClick = this.handleArLinkClick.bind(this);
  }

  componentDidMount() {
    this.fetchProductData();
    this.fetchRequisitionListsData();

    // Set the language-specific configuration for indi integration
    Config.indi.productReview.title = intl.get('indi-product-review-title');
    Config.indi.productReview.description = intl.get('indi-product-review-description');
    Config.indi.productReview.submit_button_text = intl.get('indi-product-review-submit-button-text');
  }

  static async getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.productId !== prevState.productId) {
      try {
        await login();

        const itemLookupRes = await itemLookup(nextProps.productId);

        let arFileExists = false;
        let vrFileExists = false;

        if (Config.vr.enable) {
          vrFileExists = await ProductDisplayItemMain.urlExists(Config.vr.skuVrImagesUrl.replace('%sku%', itemLookupRes._code[0].code));
        }

        if (Config.arKit.enable) {
          arFileExists = await ProductDisplayItemMain.urlExists(Config.arKit.skuArImagesUrl.replace('%sku%', itemLookupRes._code[0].code));
        }

        return {
          productId: nextProps.productId,
          productData: itemLookupRes,
          detailsProductData: itemLookupRes._definition[0].details,
          arFileExists,
          vrFileExists,
        };
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }

    return null;
  }

  async fetchProductData() {
    const { productId } = this.props;

    try {
      await login();

      await cortexFetchItemLookupForm();

      const imgIndexArr = Array.from(new Array(5), (val, index) => index);

      const promises = imgIndexArr.map(i => fetch(Config.skuImagesUrl.replace('%sku%', `${productId}_${i}`),
        { method: 'GET' }));
      const result = await Promise.all(promises);
      const validImg = result.filter(el => (el.statusText === 'OK')).map(el => (el.url));

      const itemLookupRes = await itemLookup(productId, false);
      let arFileExists = false;
      let vrFileExists = false;

      if (Config.vr.enable) {
        vrFileExists = await ProductDisplayItemMain.urlExists(Config.vr.skuVrImagesUrl.replace('%sku%', itemLookupRes._code[0].code));
      }

      if (Config.arKit.enable && document.createElement('a').relList.supports('ar')) {
        arFileExists = await ProductDisplayItemMain.urlExists(Config.arKit.skuArImagesUrl.replace('%sku%', itemLookupRes._code[0].code));
      }

      this.setState({
        productData: itemLookupRes,
        detailsProductData: itemLookupRes._definition[0].details,
        multiImages: validImg,
        arFileExists,
        vrFileExists,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  fetchRequisitionListsData() {
    login().then(() => {
      cortexFetch(`?zoom=${requisitionListsZoomArray.sort().join()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(res => res.json())
        .then((res) => {
          if (res._itemlistinfo) {
            this.setState({
              requisitionListData: res._itemlistinfo[0]._allitemlists[0]._element,
            });
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  handleQuantityChange(value) {
    this.setState({ itemQuantity: value });
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
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
    event.preventDefault();
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

  handleArLinkClick(e) {
    e.currentTarget.addEventListener('message', (event) => {
      if (event.data === '_apple_ar_quicklook_button_tapped') {
        this.addToCart(event);
      }
    }, false);
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
      return (productKindsSelection.map(ComponentEl => (
        <fieldset onChange={this.handleSelectionChange} key={Math.random().toString(36).substr(2, 9)}>
          <span className="selector-title">
            {ComponentEl.displayName}
            :&nbsp;
            {(ComponentEl.displayName.includes('Color')) ? (
              <span>{ComponentEl.defaultChousen}</span>
            ) : ''}
          </span>
          <div className="guide" id={`${(ComponentEl.displayName.includes('Color')) ? 'product_display_item_sku_guide' : 'product_display_item_size_guide'}`} onChange={this.handleSkuSelection}>
            {ComponentEl.map(Element => (
              <div key={Element._description[0]['display-name']} className={`select-wrap ${(ComponentEl.displayName.includes('Color')) ? 'color-wrap' : ''}`}>
                <input
                  key={Element._description[0].name}
                  type="radio"
                  name={ComponentEl.displayName}
                  id={`selectorWeight_${Element._description[0]['display-name'].toLowerCase().replace(/ /g, '_')}${productData._code[0].code}`}
                  value={(Element._selectaction) ? Element._selectaction[0].self.uri : ''}
                  defaultChecked={Element._description[0]['display-name'] === ComponentEl.defaultChousen || Element._selectaction[0].self.uri === selectionValue}
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
    const {
      productData,
      arFileExists,
      vrMode,
      vrFileExists,
      multiImages,
      detailsProductData,
    } = this.state;

    const productDescription = detailsProductData ? detailsProductData.filter(el => el.name === 'DESCRIPTION') : [];

    const productSummary = detailsProductData ? detailsProductData.filter(el => el.name === 'summary') : [];

    let description = '';

    if (productDescription.length > 0) {
      description = String(productDescription[0]['display-value'].split('. ', 1)[0]);
    } else if (productSummary.length > 0) {
      description = String(productSummary[0]['display-value'].split('. ', 1)[0]);
    } else {
      description = productData._definition[0]['display-name'];
    }

    const { listPrice, itemPrice } = this.extractPrice(productData);

    const price = listPrice !== itemPrice ? listPrice : itemPrice;

    const { availability } = this.extractAvailabilityParams(productData);

    const settings = {
      customPaging(i) {
        return (
          <div className="slick-thumb-item">
            <img src={multiImages[i]} alt="img" />
          </div>
        );
      },
      dots: true,
      infinite: false,
      dotsClass: 'slick-dots slick-thumb',
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    const skuArImagesUrl = availability && productData._addtocartform
      ? `${Config.arKit.skuArImagesUrl.replace('%sku%', productData._code[0].code)}#callToAction=${intl.get('add-to-cart')}&checkoutTitle=${productData._definition[0]['display-name']}&checkoutSubtitle=${description}&price=${price}`
      : Config.arKit.skuArImagesUrl.replace('%sku%', productData._code[0].code);

    return (
      <div className={`product-image-carousel-wrap ${multiImages.length > 0 ? '' : 'single-image-slider'}`}>
        <div className="product-image-carousel">
          {
            !vrMode && vrFileExists && (
              <button type="button" className="vr-icon-container" onClick={() => this.initVR()} />
            )
          }
          {
            arFileExists && (
              <a href={skuArImagesUrl} rel="ar" className="anchor-ar-container" id="ar-link" onClick={e => this.handleArLinkClick(e)}>
                <img
                  src={transparentImg}
                  alt=""
                  className="ar-img"
                />
              </a>
            )
          }
          <Slider {...settings}>
            {multiImages.length > 0 ? (
              multiImages.map(el => (
                <div key={el}>
                  <img src={el} alt={intl.get('none-available')} className="itemdetail-main-img" />
                </div>
              ))
            ) : (
              <div>
                <ImageContainer className="itemdetail-main-img" isSkuImage fileName={productData._code[0].code} imgUrl={Config.skuImagesUrl.replace('%sku%', productData._code[0].code)} />
              </div>
            )}
          </Slider>
        </div>
      </div>
    );
  }

  addToSelectedCart(cart, onCountChange) {
    const { itemQuantity, itemConfiguration } = this.state;
    this.setState({ addToCartLoading: true });

    const cartName = cart._target[0]._descriptor[0].name ? cart._target[0]._descriptor[0].name : intl.get('default');
    const cartUrl = cart._addtocartaction[0].self.uri;

    login()
      .then(() => cortexFetch(cartUrl,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
          body: JSON.stringify({
            quantity: itemQuantity,
            configuration: itemConfiguration,
          }),
        }))
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          onCountChange(cartName, itemQuantity);
        }
        this.setState({ addToCartLoading: false });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
        this.setState({ addToCartLoading: false });
      });
  }

  initVR() {
    this.setState({ vrMode: true });
  }

  closeVR() {
    this.setState({ vrMode: false });
  }

  getVRBackgroundImg() {
    const { productData } = this.state;
    return Config.vr.skuVrImagesUrl.replace('%sku%', `${productData._code[0].code}`);
  }

  render() {
    const {
      productData, isLoading, itemQuantity, addToCartLoading, requisitionListData, vrMode, detailsProductData,
    } = this.state;
    const multiCartData = ((productData && productData._addtocartforms) || []).flatMap(addtocartforms => addtocartforms._element);
    const { featuredProductAttribute, itemDetailLink } = this.props;

    if (productData) {
      const { availability } = this.extractAvailabilityParams(productData);
      const isMultiCartEnabled = (productData._addtocartforms || []).flatMap(forms => forms._element).length > 0;

      return (
        <div className="itemdetail-component container-3">
          <div className="product-item-container">
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

                  {vrMode ? (<VRProductDisplayItem handleCloseVR={() => { this.closeVR(); }} backgroundUri={this.getVRBackgroundImg()} />) : this.renderProductImage()}

                </div>
              </div>
            </div>

            <div className="itemdetail-details">
              <div data-region="itemDetailTitleRegion" style={{ display: 'block' }}>
                <div>
                  <h1 className="itemdetail-title" id={`category_item_title_${productData._code[0].code}`}>
                    {productData._definition[0]['display-name']}
                    {requisitionListData && ProductDisplayItemMain.isLoggedIn(Config) && (
                      <button type="button" className="add-to-wish-list-link" onClick={this.addToWishList} disabled={!availability || !productData._addtowishlistform}>
                        +
                        {' '}
                        {intl.get('add-to-wish-list')}
                      </button>
                    )}
                  </h1>
                  {(Config.b2b.enable) && (
                    <h4 className="itemdetail-title-sku" id={`category_item_sku_${productData._code[0].code}`}>
                      {productData._code[0].code}
                    </h4>
                  )}
                </div>
              </div>
              <ProductPriceContainer productData={productData} />
              <div className="itemdetail-addtocart" data-region="itemDetailAddToCartRegion" style={{ display: 'block' }}>
                <div>
                  <form className="itemdetail-addtocart-form form-horizontal" onSubmit={(event) => { if (isMultiCartEnabled) { event.preventDefault(); } else { this.addToCart(event); } }}>
                    {this.renderConfiguration()}
                    {this.renderSkuSelection()}
                    <ProductQuantityPicker loading={isLoading} value={itemQuantity} onChange={this.handleQuantityChange} />
                    <div className="form-group-submit">
                      {isMultiCartEnabled ? (
                        <DropdownCartSelection multiCartData={multiCartData} addToSelectedCart={this.addToSelectedCart} isDisabled={!availability || !productData._addtocartform} showLoader={addToCartLoading} btnTxt={intl.get('add-to-cart')} />
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

                  </form>
                  {(ProductDisplayItemMain.isLoggedIn(Config) && productData._addtocartform) ? (
                    <form className="itemdetail-addtowishlist-form form-horizontal">
                      <div className="form-group-submit">
                        {requisitionListData ? (
                          <ProductRequisitionListButton productData={productData} requisitionListData={requisitionListData} itemQuantity={itemQuantity} />
                        ) : (
                          <div className="form-content form-content-submit col-sm-offset-4">
                            <button
                              onClick={this.addToWishList}
                              className="ep-btn btn-itemdetail-addtowishlist"
                              disabled={!availability || !productData._addtowishlistform}
                              id="product_display_item_add_to_wish_list_button"
                              type="submit"
                            >
                              {intl.get('add-to-wish-list')}
                            </button>
                          </div>
                        )}
                      </div>
                    </form>
                  ) : ('')
                  }
                </div>
                <ProductSocialNetworkSharing productData={productData} />
              </div>
              <PowerReview productData={productData} />
            </div>
          </div>
          <ProductAttributesContainer detailsProductData={detailsProductData} />
          <BundleConstituentsDisplayMain productData={productData} itemDetailLink={itemDetailLink} />
          <ProductRecommendationsDisplayMain productData={productData} itemDetailLink={itemDetailLink} />
          <IndiRecommendationsDisplayMain render={['carousel', 'product']} configuration={Config.indi} keywords={productData._code[0].code} />
        </div>
      );
    }

    return (<div className="loader" />);
  }
}

export default ProductDisplayItemMain;
