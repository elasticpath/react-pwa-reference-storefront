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
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import { login, isLoggedIn } from '../utils/AuthService';
import { cortexFetch } from '../utils/Cortex';
import PowerReview from '../PowerReview/powerreview.main';
import DropdownCartSelection from '../DropdownCartSelection/dropdown.cart.selection.main';
import { useRequisitionListCountDispatch } from '../requisition-list-count-context';
import { ProductDisplayDetailsProps, ProductDisplayItemMainState } from './productdisplayitem.details.d';
import SocialNetworkSharing from '../SocialNetworkSharing/socialNetworkSharing';
import QuantitySelector from '../QuantitySelector/quantitySelector';
import './productdisplayitem.details.less';

let Config: IEpConfig | any = {};

export const ZOOM : string[] = [
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


class ProductDisplayItemDetails extends Component<ProductDisplayDetailsProps, ProductDisplayItemMainState> {
  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;

    this.state = {
      itemQuantity: 1,
      isLoading: false,
      itemConfiguration: {},
      selectionValue: '',
      addToCartLoading: false,
      addToRequisitionListLoading: false,
      requisitionListData: undefined,
    };

    this.addToWishList = this.addToWishList.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.handleQuantityDecrement = this.handleQuantityDecrement.bind(this);
    this.handleQuantityIncrement = this.handleQuantityIncrement.bind(this);
    this.handleConfiguration = this.handleConfiguration.bind(this);
    this.handleSkuSelection = this.handleSkuSelection.bind(this);
    this.addToSelectedCart = this.addToSelectedCart.bind(this);
    this.renderConfiguration = this.renderConfiguration.bind(this);
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
  }

  static extractProductDetails(productData) {
    const productTitle = productData._definition[0]['display-name'];
    const productDescription = productData._definition[0].details ? (productData._definition[0].details.find(detail => detail['display-name'] === 'Summary' || detail['display-name'] === 'Description')) : '';
    const productDescriptionValue = productDescription !== undefined ? productDescription['display-value'] : '';
    const productImage = Config.skuImagesUrl.replace('%sku%', productData._code[0].code);
    return {
      productImage, productDescriptionValue, productTitle,
    };
  }

  static extractPrice(productData) {
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

  static extractAvailabilityParams(productData) {
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

  static addToCart(event, itemQuantity, itemConfiguration, productData, onAddToCart) {
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
    const { itemQuantity, itemConfiguration } = this.state;
    const { onAddToWishList, productData } = this.props;

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

  handleSkuSelection(event) {
    const { onChangeProductFeature } = this.props;
    const selfUri = event.target.value;
    this.setState({
      isLoading: true,
    });
    login().then(() => {
      cortexFetch(`${selfUri}?followlocation=true&zoom=${ZOOM.sort().join()}`,
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

  handleConfiguration(configuration, event) {
    const { itemConfiguration } = this.state;
    itemConfiguration[configuration] = event.target.value;
    this.setState({ itemConfiguration });
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

  renderConfiguration() {
    const { isLoading } = this.state;
    const { productData } = this.props;
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
    const { productData } = this.props;
    const { selectionValue } = this.state;
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

  handleSelectionChange(event) {
    this.setState({ selectionValue: event.target.value });
  }

  dropdownRequisitionListSelection() {
    const dispatch = useRequisitionListCountDispatch();
    const onCountChange = (name, count) => {
      const data = {
        type: 'COUNT_SHOW',
        payload: {
          count,
          name,
        },
      };
      dispatch(data);
      setTimeout(() => {
        dispatch({ type: 'COUNT_HIDE' });
      }, 3200);
    };
    const { requisitionListData } = this.state;
    if (requisitionListData) {
      return (
        <ul className="cart-selection-list">
          {requisitionListData.map(list => (
            // eslint-disable-next-line
            <li className="dropdown-item cart-selection-menu-item" key={list.name ? list.name : intl.get('default')} onClick={() => this.addToRequisitionListData(list, onCountChange)}>
              {list.name ? list.name : intl.get('default')}
            </li>
          ))}
        </ul>
      );
    }
    return null;
  }

  addToRequisitionListData(list, onCountChange) {
    const listUrl = list._additemstoitemlistform[0].self.uri;
    const { itemQuantity } = this.state;
    const { productData } = this.props;
    const { name } = list;

    this.setState({ addToRequisitionListLoading: true });
    login().then(() => {
      const body: { [key: string]: any } = {};
      body.items = { code: productData._code[0].code, quantity: itemQuantity };
      cortexFetch(listUrl,
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
            this.setState({ addToRequisitionListLoading: false });
            onCountChange(name, itemQuantity);
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
          this.setState({ addToRequisitionListLoading: false });
        });
    });
  }

  handleQuantityChange(event) {
    const { itemQuantity } = this.state;
    if (event.target.value === '') {
      this.setState({ itemQuantity: 1 });
    } else {
      this.setState({ itemQuantity: parseInt(event.target.value, 10) });
    }
  }

  render() {
    const {
      addToCartLoading,
      isLoading,
      addToRequisitionListLoading,
      itemQuantity,
      itemConfiguration,
    } = this.state;
    const { productData, requisitionListData, onAddToCart } = this.props;
    const { availability, availabilityString, productLink } = ProductDisplayItemDetails.extractAvailabilityParams(productData);
    const { listPrice, itemPrice } = ProductDisplayItemDetails.extractPrice(productData);
    const multiCartData = ((productData && productData._addtocartforms) || []).flatMap(addtocartforms => addtocartforms._element);
    const SelectCartButton = () => (
      <DropdownCartSelection multiCartData={multiCartData} addToSelectedCart={this.addToSelectedCart} isDisabled={!availability || !productData._addtocartform} showLoader={addToCartLoading} btnTxt={intl.get('add-to-cart')} />
    );
    const isMultiCartEnabled = (productData._addtocartforms || []).flatMap(forms => forms._element).length > 0;
    const {
      productImage, productDescriptionValue, productTitle,
    } = ProductDisplayItemDetails.extractProductDetails(productData);
    const SelectRequisitionListButton = () => (
      <div className="form-content form-content-submit dropdown cart-selection-dropdown">
        <button
          className="ep-btn btn-itemdetail-addtowishlist dropdown-toggle"
          data-toggle="dropdown"
          disabled={!availability || !productData._addtowishlistform}
          type="submit"
        >
          {addToRequisitionListLoading ? (
            <span className="miniLoader" />
          ) : (
            <span>
              {intl.get('add-to-requisition-list')}
            </span>
          )}
        </button>
        <div className="dropdown-menu cart-selection-menu cart-selection-list">
          {this.dropdownRequisitionListSelection()}
        </div>
      </div>
    );

    if (productData) {
      return (
        <div className="itemdetail-details">
          <div data-region="itemDetailTitleRegion" style={{ display: 'block' }}>
            <div>
              <h1 className="itemdetail-title" id={`category_item_title_${productData._code[0].code}`}>
                {productData._definition[0]['display-name']}
                {requisitionListData && isLoggedIn(Config) && (
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
              <form className="itemdetail-addtocart-form form-horizontal" onSubmit={(event) => { if (isMultiCartEnabled) { event.preventDefault(); } else { ProductDisplayItemDetails.addToCart(event, itemQuantity, itemConfiguration, productData, onAddToCart); } }}>
                {this.renderConfiguration()}
                {this.renderSkuSelection()}
                <QuantitySelector
                  handleQuantityDecrement={this.handleQuantityDecrement}
                  handleQuantityIncrement={this.handleQuantityIncrement}
                  handleQuantityChange={this.handleQuantityChange}
                  isLoading={isLoading}
                  itemQuantity={itemQuantity}
                />
                <div className="form-group-submit">
                  {isMultiCartEnabled ? (
                    <SelectCartButton />
                  ) : (
                    <div className="form-content form-content-submit col-sm-offset-4">
                      <button
                        className="ep-btn primary btn-itemdetail-addtocart"
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
              {(isLoggedIn(Config) && productData._addtocartform) ? (
                <form className="itemdetail-addtowishlist-form form-horizontal">
                  <div className="form-group-submit">
                    {requisitionListData ? (
                      <SelectRequisitionListButton />
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
            <SocialNetworkSharing
              productLink={productLink}
              productImage={productImage}
              productDescriptionValue={productDescriptionValue}
              productTitle={productTitle}
            />
          </div>
          <PowerReview productData={productData} />
        </div>
      );
    }

    return (<div className="loader" />);
  }
}

export default ProductDisplayItemDetails;
