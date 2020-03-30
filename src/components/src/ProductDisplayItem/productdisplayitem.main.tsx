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
import intl from 'react-intl-universal';
import Slider from 'react-slick';
import { login } from '../utils/AuthService';
import { itemLookup, cortexFetchItemLookupForm } from '../utils/CortexLookup';
import transparentImg from '../../../images/icons/transparent.png';
import ProductRecommendationsDisplayMain from '../ProductRecommendations/productrecommendations.main';
import IndiRecommendationsDisplayMain from '../IndiRecommendations/indirecommendations.main';
import BundleConstituentsDisplayMain from '../BundleConstituents/bundleconstituents.main';
import { cortexFetch } from '../utils/Cortex';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import VRProductDisplayItem from '../VRProductDisplayItem/VRProductDisplayItem';
import ProductDisplayItemDetails from '../ProductDisplayItemDetails/productdisplayitem.details';
import './productdisplayitem.main.less';
import ImageContainer from '../ImageContainer/image.container';
import { ProductDisplayItemMainProps, ProductDisplayItemMainState } from './productdisplayitem.main.d';
import ProductDisplayAttributes from '../ProductDisplayAttributes/productDisplayAttributes';

let Config: IEpConfig | any = {};

const REQUISITION_LISTS_ZOOM : string[] = [
  'itemlistinfo',
  'itemlistinfo:allitemlists',
  'itemlistinfo:allitemlists:element',
  'itemlistinfo:allitemlists:element:additemstoitemlistform',
];

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

    this.state = {
      productId: '',
      productData: undefined,
      requisitionListData: undefined,
      arFileExists: false,
      backgroundVRImageExists: false,
      meshVRImageExists: false,
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
    this.getVRMesh = this.getVRMesh.bind(this);
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
        let backgroundVRImageExists = false;
        let meshVRImageExists = false;

        if (Config.vr.enable) {
          backgroundVRImageExists = await ProductDisplayItemMain.urlExists(Config.vr.skuVrImagesUrl.replace('%sku%', itemLookupRes._code[0].code));
          meshVRImageExists = await ProductDisplayItemMain.urlExists(Config.vr.skuVrMeshesUrl.replace('%sku%', itemLookupRes._code[0].code));
        }

        if (Config.arKit.enable) {
          arFileExists = await ProductDisplayItemMain.urlExists(Config.arKit.skuArImagesUrl.replace('%sku%', itemLookupRes._code[0].code));
        }

        return {
          productId: nextProps.productId,
          productData: itemLookupRes,
          detailsProductData: itemLookupRes._definition[0].details,
          arFileExists,
          backgroundVRImageExists,
          meshVRImageExists,
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
      let backgroundVRImageExists = false;
      let meshVRImageExists = false;

      if (Config.vr.enable) {
        backgroundVRImageExists = await ProductDisplayItemMain.urlExists(Config.vr.skuVrImagesUrl.replace('%sku%', itemLookupRes._code[0].code));
        meshVRImageExists = await ProductDisplayItemMain.urlExists(Config.vr.skuVrMeshesUrl.replace('%sku%', itemLookupRes._code[0].code));
      }

      if (Config.arKit.enable && document.createElement('a').relList.supports('ar')) {
        arFileExists = await ProductDisplayItemMain.urlExists(Config.arKit.skuArImagesUrl.replace('%sku%', itemLookupRes._code[0].code));
      }

      this.setState({
        productData: itemLookupRes,
        detailsProductData: itemLookupRes._definition[0].details,
        multiImages: validImg,
        arFileExists,
        backgroundVRImageExists,
        meshVRImageExists,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  fetchRequisitionListsData() {
    login().then(() => {
      cortexFetch(`?zoom=${REQUISITION_LISTS_ZOOM.sort().join()}`, {
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

  renderProductImage() {
    const {
      productData,
      arFileExists,
      vrMode,
      backgroundVRImageExists,
      meshVRImageExists,
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
            !vrMode && (backgroundVRImageExists || meshVRImageExists) && (
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
    const { productData, backgroundVRImageExists } = this.state;
    const backgroundUrl = Config.vr.skuVrImagesUrl.replace('%sku%', productData._code[0].code);

    if (backgroundVRImageExists) {
      return backgroundUrl;
    }

    return '';
  }

  getVRMesh() {
    const { productData, meshVRImageExists } = this.state;
    const meshUrl = Config.vr.skuVrMeshesUrl.replace('%sku%', productData._code[0].code);

    if (meshVRImageExists) {
      return meshUrl;
    }

    return '';
  }

  render() {
    const {
      productData, requisitionListData, vrMode, detailsProductData,
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
              <div data-region="itemDetailAssetRegion">
                <div className="itemdetail-asset-container">
                  {(featuredProductAttribute)
                    ? (
                      <div className="featured">
                        {intl.get('featured')}
                      </div>
                    )
                    : ('')
                  }

                  {vrMode ? (<VRProductDisplayItem meshUri={this.getVRMesh()} handleCloseVR={() => { this.closeVR(); }} backgroundUri={this.getVRBackgroundImg()} />) : this.renderProductImage()}

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
            <ProductDisplayAttributes handleDetailAttribute={this.handleDetailAttribute} detailsProductData={detailsProductData} />
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
