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
import { InlineShareButtons } from 'sharethis-reactjs';
import { login, isLoggedIn } from '../utils/AuthService';
import { itemLookup, cortexFetchItemLookupForm } from '../utils/CortexLookup';
import transparentImg from '../../../images/icons/transparent.png';
import ProductRecommendationsDisplayMain from '../ProductRecommendations/productrecommendations.main';
import IndiRecommendationsDisplayMain from '../IndiRecommendations/indirecommendations.main';
import BundleConstituentsDisplayMain from '../BundleConstituents/bundleconstituents.main';
import DropdownCartSelection from '../DropdownCartSelection/dropdown.cart.selection.main';
import { cortexFetch } from '../utils/Cortex';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import { useRequisitionListCountDispatch } from '../requisition-list-count-context';
import VRProductDisplayItem from '../VRProductDisplayItem/VRProductDisplayItem';
import ProductDisplayItemDetails from './productdisplayitem.details';
import './productdisplayitem.main.less';
import PowerReview from '../PowerReview/powerreview.main';
import ImageContainer from '../ImageContainer/image.container';

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
  arFileExists: boolean,
  vrFileExists: boolean,
  itemConfiguration: { [key: string]: any },
  detailsProductData: any,
  vrMode: boolean;
  multiImages: any,
}

class ProductDisplayItemMain extends Component<ProductDisplayItemMainProps, ProductDisplayItemMainState> {
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

  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    ({ intl } = epConfig);
    this.state = {
      productId: '',
      productData: undefined,
      requisitionListData: undefined,
      arFileExists: false,
      vrFileExists: false,
      itemConfiguration: {},
      detailsProductData: [],
      vrMode: false,
      multiImages: [],
    };

    this.renderProductImage = this.renderProductImage.bind(this);
    this.handleDetailAttribute = this.handleDetailAttribute.bind(this);
    this.initVR = this.initVR.bind(this);
    this.closeVR = this.closeVR.bind(this);
    this.getVRBackgroundImg = this.getVRBackgroundImg.bind(this);
    this.handleArLinkClick = this.handleArLinkClick.bind(this);
  }

  componentDidMount() {
    this.fetchProductData();
    this.fetchRequisitionListsData();
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

  handleDetailAttribute(index) {
    const { detailsProductData } = this.state;
    detailsProductData[index].isOpened = !detailsProductData[index].isOpened;
    this.setState({ detailsProductData });
  }

  handleArLinkClick(e) {
    const { itemConfiguration, productData } = this.state;
    const { onAddToCart } = this.props;

    e.currentTarget.addEventListener('message', (event) => {
      if (event.data === '_apple_ar_quicklook_button_tapped') {
        ProductDisplayItemDetails.addToCart(event, 1, itemConfiguration, productData, onAddToCart);
      }
    }, false);
  }

  renderAttributes() {
    const { detailsProductData } = this.state;
    if (detailsProductData) {
      return detailsProductData.map((attribute, index) => (
        <li key={attribute.name} className="detail-list-item">
          <div className="item-detail-attribute-label-col">
            {attribute['display-name']}
            <span className={`item-arrow-btn ${attribute.isOpened ? 'up' : ''}`} role="presentation" onClick={() => this.handleDetailAttribute(index)} />
          </div>
          <div className={`item-detail-attribute-value-col ${attribute.isOpened ? '' : 'hide'}`}>
            {attribute['display-value']}
          </div>
        </li>
      ));
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

    const { listPrice, itemPrice } = ProductDisplayItemDetails.extractPrice(productData);

    const price = listPrice !== itemPrice ? listPrice : itemPrice;

    const { availability } = ProductDisplayItemDetails.extractAvailabilityParams(productData);

    const settings = {
      customPaging(i) {
        return (
          <div className="slick-thumb-item">
            <img src={multiImages[i]} alt="" />
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
      productData, requisitionListData, vrMode,
    } = this.state;

    const {
      featuredProductAttribute, itemDetailLink, onAddToWishList, onChangeProductFeature, onAddToCart,
    } = this.props;

    if (productData) {
      // Set the language-specific configuration for indi integration
      Config.indi.productReview.title = intl.get('indi-product-review-title');
      Config.indi.productReview.description = intl.get('indi-product-review-description');
      Config.indi.productReview.submit_button_text = intl.get('indi-product-review-submit-button-text');

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
            <ProductDisplayItemDetails productData={productData} requisitionListData={requisitionListData} onAddToWishList={onAddToWishList} onChangeProductFeature={onChangeProductFeature} onAddToCart={onAddToCart} />
          </div>
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
                <ul className="item-detail-attributes" data-region="itemDetailAttributeRegion">
                  {this.renderAttributes()}
                </ul>
              </div>
              <div className="tab-pane fade" id="reviews" role="tabpanel" aria-labelledby="reviews-tab">
                <div id="pr-reviewdisplay" />
              </div>
              <div className="tab-pane fade" id="questions" role="tabpanel" aria-labelledby="questions-tab">
                <div id="pr-questiondisplay" />
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

export default ProductDisplayItemMain;
