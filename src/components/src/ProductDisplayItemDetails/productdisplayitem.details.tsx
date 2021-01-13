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
import Config from '../../../ep.config.json';
import { isLoggedIn } from '../utils/AuthService';
import { login } from '../../../hooks/store';
import { cortexFetch } from '../utils/Cortex';
import PowerReview from '../PowerReview/powerreview.main';
import DropdownCartSelection from '../DropdownCartSelection/dropdown.cart.selection.main';
import { useRequisitionListCountDispatch } from '../requisition-list-count-context';
import { ProductDisplayDetailsProps, ProductDisplayItemMainState } from './productdisplayitem.details.d';
import SocialNetworkSharing from '../SocialNetworkSharing/socialNetworkSharing';
import QuantitySelector from '../QuantitySelector/quantitySelector';

import './productdisplayitem.details.scss';


export const ZOOM : string = [
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
].sort().join();


class ProductDisplayItemDetails extends Component<ProductDisplayDetailsProps, ProductDisplayItemMainState> {
  constructor(props) {
    super(props);

    this.state = {
      itemQuantity: 1,
      itemConfiguration: {},
      selectionValue: '',
      addToCartLoading: false,
      addToRequisitionListLoading: false,
      isAdded: false,
    };

    this.addToWishList = this.addToWishList.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.handleQuantityDecrement = this.handleQuantityDecrement.bind(this);
    this.handleQuantityIncrement = this.handleQuantityIncrement.bind(this);
    this.handleConfiguration = this.handleConfiguration.bind(this);
    this.handleSkuSelection = this.handleSkuSelection.bind(this);
    this.addToSelectedCart = this.addToSelectedCart.bind(this);
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
    let itemPrice = 'n/a';
    if (productData._price) {
      listPrice = productData._price[0]['list-price'][0].display;
      itemPrice = productData._price[0]['purchase-price'][0].display;
    }
    return {
      listPrice,
      itemPrice,
    };
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
    const { onChangeProductFeature, handleLoading } = this.props;
    const selfUri = event.target.value;
    handleLoading();
    login().then(() => {
      cortexFetch(`${selfUri}?followlocation=true&zoom=${ZOOM}`,
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
    const { isQuickView } = this.props;
    this.setState({ addToCartLoading: true });

    const cartName = cart._target[0]._descriptor[0].name || intl.get('default');
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
          if (isQuickView) {
            this.setState({ isAdded: true });
          }
        }
        this.setState({ addToCartLoading: false });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
        this.setState({ addToCartLoading: false });
      });
  }

  handleSelectionChange(event) {
    this.setState({ selectionValue: event.target.value });
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
    if (event.target.value === '') {
      this.setState({ itemQuantity: 1 });
    } else {
      this.setState({ itemQuantity: parseInt(event.target.value, 10) });
    }
  }

  render() {
    const {
      addToCartLoading,
      addToRequisitionListLoading,
      itemQuantity,
      itemConfiguration,
      isAdded,
      selectionValue,
    } = this.state;

    const {
      productData,
      requisitionListData,
      onAddToCart,
      itemIndex,
      isQuickView,
      isLoading,
    } = this.props;

    const { availability, availabilityString, productLink } = ProductDisplayItemDetails.extractAvailabilityParams(productData);
    const { listPrice, itemPrice } = ProductDisplayItemDetails.extractPrice(productData);
    const multiCartData = ((productData && productData._addtocartforms) || []).flatMap(addtocartforms => addtocartforms._element);
    const isMultiCartEnabled = (productData._addtocartforms || []).flatMap(forms => forms._element).length > 0;
    const { productImage, productDescriptionValue, productTitle } = ProductDisplayItemDetails.extractProductDetails(productData);

    if (productData) {
      return (
        <div className="itemdetail-details">

          <ItemDetailTitleRegion
            productData={productData}
            availability={availability}
            requisitionListData={requisitionListData}
            addToWishList={this.addToWishList}
          />

          <ItemDetailPriceRegion
            productData={productData}
            listPrice={listPrice}
            itemPrice={itemPrice}
            isQuickView={isQuickView}
          />

          <ItemDetailAvailabilityRegion
            productData={productData}
            availability={availability}
            availabilityString={availabilityString}
            isQuickView={isQuickView}
          />

          <div
            className="itemdetail-addtocart"
            data-region="itemDetailAddToCartRegion"
            style={{ display: 'block' }}
          >
            <div>
              <form
                className="itemdetail-addtocart-form form-horizontal"
                onSubmit={(event) => { if (isMultiCartEnabled) { event.preventDefault(); } else { ProductDisplayItemDetails.addToCart(event, itemQuantity, itemConfiguration, productData, onAddToCart); } }}
              >

                <ItemDetailConfigurationRegion
                  productData={productData}
                  isLoading={isLoading}
                  handleConfiguration={this.handleConfiguration}
                />

                <ItemDetailSkuSelection
                  productData={productData}
                  itemIndex={itemIndex}
                  selectionValue={selectionValue}
                  handleSelectionChange={this.handleSelectionChange}
                  handleSkuSelection={this.handleSkuSelection}
                />

                <QuantitySelector
                  handleQuantityDecrement={this.handleQuantityDecrement}
                  handleQuantityIncrement={this.handleQuantityIncrement}
                  handleQuantityChange={this.handleQuantityChange}
                  isLoading={isLoading}
                  itemQuantity={itemQuantity}
                  itemIndex={itemIndex}
                />

                <div className="form-group-submit">
                  {isMultiCartEnabled ? (
                    <DropdownCartSelection
                      itemIndex={itemIndex}
                      multiCartData={multiCartData}
                      addToSelectedCart={this.addToSelectedCart}
                      isDisabled={!availability || !productData._addtocartform}
                      showLoader={addToCartLoading}
                      btnTxt={!isAdded ? intl.get('add-to-cart') : intl.get('added')}
                    />
                  ) : (
                    <div className="form-content form-content-submit col-sm-offset-4">
                      <button
                        className="ep-btn primary btn-itemdetail-addtocart"
                        disabled={!availability || !productData._addtocartform}
                        id={`product_display_item_add_to_cart_button${itemIndex || ''}`}
                        type="submit"
                      >
                        <span>{intl.get('add-to-cart')}</span>
                      </button>
                    </div>
                  )}
                </div>

              </form>
              {(isLoggedIn(Config) && productData._addtocartform) ? (
                <form className="itemdetail-addtowishlist-form form-horizontal">
                  <div className="form-group-submit">
                    {requisitionListData ? (
                      <SelectRequisitionListButton
                        addToRequisitionListData={this.addToRequisitionListData}
                        addToRequisitionListLoading={addToRequisitionListLoading}
                        availability={availability}
                        productData={productData}
                        requisitionListData={requisitionListData}
                      />
                    ) : (
                      <div className="form-content form-content-submit col-sm-offset-4">
                        <button
                          onClick={this.addToWishList}
                          className="ep-btn btn-itemdetail-addtowishlist"
                          disabled={!availability || !productData._addtowishlistform}
                          id={`product_display_item_add_to_wish_list_button${itemIndex || ''}`}
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
            {!isQuickView && (
              <SocialNetworkSharing
                productLink={productLink}
                productImage={productImage}
                productDescriptionValue={productDescriptionValue}
                productTitle={productTitle}
              />
            )}
          </div>
          <PowerReview productData={productData} itemIndex={itemIndex} />
        </div>
      );
    }

    return (<div className="loader" />);
  }
}

export default ProductDisplayItemDetails;

function ItemDetailTitleRegion({
  productData,
  availability,
  requisitionListData,
  addToWishList,
}) {
  const loggedIn = isLoggedIn(Config);
  const { code } = productData._code[0];
  const displayName = productData._definition[0]['display-name'];

  return (
    <div data-region="itemDetailTitleRegion" style={{ display: 'block' }}>
      <div>
        <h1 className="itemdetail-title" id={`category_item_title_${code}`}>
          {displayName}
          {requisitionListData && loggedIn && (
          <button
            type="button"
            className="add-to-wish-list-link"
            onClick={addToWishList}
            disabled={!availability || !productData._addtowishlistform}
          >
              +
            {' '}
            {intl.get('add-to-wish-list')}
          </button>
          )}
        </h1>
        {(Config.b2b.enable) && (
        <p className="itemdetail-title-sku" id={`category_item_sku_${code}`}>
          {code}
        </p>
        )}
      </div>
    </div>
  );
}

function ItemDetailPriceRegion({
  productData,
  listPrice,
  itemPrice,
  isQuickView,
}) {
  const { code } = productData._code[0];

  return (
    <div
      className="itemdetail-price-container itemdetail-price-wrap"
      data-region="itemDetailPriceRegion"
      style={{ display: 'block' }}
    >
      <div>
        <div data-region="itemPriceRegion" style={{ display: 'block' }}>
          <ul className="itemdetail-price-container">
            {
              listPrice !== itemPrice
                ? (
                  <li className="itemdetail-purchase-price">
                    <p
                      className="itemdetail-purchase-price-value price-sale"
                      id={`category_item_price_${!isQuickView ? code : ''}`}
                    >
                      {itemPrice}
                    </p>
                    <span
                      className="itemdetail-list-price-value"
                      data-region="itemListPriceRegion"
                      id={`category_item_list_price_${code}`}
                    >
                      {listPrice}
                    </span>
                  </li>
                )
                : (
                  <li className="itemdetail-purchase-price">
                    <p
                      className="itemdetail-purchase-price-value"
                      id={`category_item_price_${code}`}
                    >
                      {itemPrice}
                    </p>
                  </li>
                )
              }
          </ul>
        </div>
        <div data-region="itemRateRegion" />
      </div>
    </div>
  );
}

function ItemDetailAvailabilityRegion({
  productData,
  availability,
  availabilityString,
  isQuickView,
}) {
  const { code } = productData._code[0];
  const releaseDate = productData._availability[0]['release-date'];

  return (
    <div data-region="itemDetailAvailabilityRegion" style={{ display: 'block' }}>
      <ul className="itemdetail-availability-container">
        <li className="itemdetail-availability itemdetail-availability-state" data-i18n="AVAILABLE">
          <label htmlFor={`category_item_availability_${code}`}>
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
        <li
          className={`itemdetail-release-date${releaseDate ? '' : ' is-hidden'}`}
          data-region="itemAvailabilityDescriptionRegion"
        >
          <label
            htmlFor={`category_item_release_date_${!isQuickView ? code : ''}`}
            className="itemdetail-release-date-label"
          >
            {intl.get('expected-release-date')}
              :&nbsp;
          </label>
          <span
            className="itemdetail-release-date-value"
            id={`category_item_release_date_${!isQuickView ? code : ''}`}
          >
            {releaseDate ? ['display-value'] : ''}
          </span>
        </li>
      </ul>
    </div>
  );
}

function ItemDetailConfigurationRegion({
  productData,
  isLoading,
  handleConfiguration,
}) {
  const isConfigurable = Boolean(productData._addtocartform && productData._addtocartform[0].configuration);
  if (!isConfigurable) {
    return (<></>);
  }

  const keys = Object.keys(productData._addtocartform[0].configuration);
  return (
    <>
      {keys.map(key => (
        <div key={key} className="form-group">
          <label
            htmlFor={`product_display_item_configuration_${key}_label`}
            className="control-label"
          >
            {key}
          </label>
          <div className="form-content">
            <input
              className="form-control form-control-text"
              disabled={isLoading}
              onChange={e => handleConfiguration(key, e)}
              id={`product_display_item_configuration_${key}_label`}
              value={productData._addtocartform[0].configuration.key}
            />
          </div>
        </div>
      ))}
    </>
  );
}

function ItemDetailSkuSelection({
  productData,
  itemIndex,
  selectionValue,
  handleSelectionChange,
  handleSkuSelection,
}) {
  const productKindsSelection = [];
  const sizes = ['X-Small', 'Small', 'Medium', 'Large', 'X-Large'];

  if (!productData._definition[0]._options) {
    return null;
  }

  productData._definition[0]._options[0]._element.forEach((ChoiceElement, index) => {
    const selectorTitle = ChoiceElement['display-name'];
    const chosenItem = ChoiceElement._selector[0]._chosen[0];
    const arraySelectors = [chosenItem, ...(ChoiceElement._selector[0]._choice || [])];

    if (selectorTitle === 'Size') {
      arraySelectors.sort((a, b) => {
        if (sizes.indexOf(a._description[0]['display-name']) < sizes.indexOf(b._description[0]['display-name'])) {
          return -1;
        }
        if (sizes.indexOf(a._description[0]['display-name']) > sizes.indexOf(b._description[0]['display-name'])) {
          return 1;
        }
        return 0;
      });
    } else {
      arraySelectors.sort((a, b) => {
        if (a._description[0]['display-name'] < b._description[0]['display-name']) {
          return -1;
        }
        if (a._description[0]['display-name'] > b._description[0]['display-name']) {
          return 1;
        }
        return 0;
      });
    }
    productKindsSelection.push(arraySelectors);
    productKindsSelection[index].displayName = selectorTitle;
    productKindsSelection[index].defaultChousen = chosenItem._description[0]['display-name'];
  });

  return (
    <>
      {productKindsSelection.map(ComponentEl => (
        <fieldset
          onChange={handleSelectionChange}
          key={Math.random().toString(36).substr(2, 9)}
        >
          <span className="selector-title">
            {ComponentEl.displayName}
            :&nbsp;
            {(ComponentEl.displayName.includes('Color')) ? (
              <span>{ComponentEl.defaultChousen}</span>
            ) : ''}
          </span>
          <div
            className="guide"
            id={`${(ComponentEl.displayName.includes('Color')) ? 'product_display_item_sku_guide' : 'product_display_item_size_guide'}${itemIndex || ''}`}
            onChange={handleSkuSelection}
          >
            {ComponentEl.map(Element => (

              <SkuSelectAxisOption
                optionData={Element}
                axisDisplayName={ComponentEl.displayName}
                defaultChosen={ComponentEl.defaultChousen}
                code={productData._code[0].code}
                selectionValue={selectionValue}
              />

            ))}
          </div>
        </fieldset>
      ))}
    </>
  );
}

function SkuSelectAxisOption({
  optionData,
  axisDisplayName,
  defaultChosen,
  code,
  selectionValue,
}) {
  const optionName = optionData._description[0].name;
  const optionDisplayName = optionData._description[0]['display-name'];
  const optionSelectUri = optionData._selectaction[0].self.uri;
  const optionDisplayNameIdString = optionDisplayName.toLowerCase().replace(/ /g, '_');

  return (
    <div
      key={optionName}
      className={`select-wrap ${(axisDisplayName.includes('Color')) ? 'color-wrap' : ''}`}
    >
      <input
        key={optionName}
        type="radio"
        name={axisDisplayName}
        id={`selectorWeight_${optionDisplayNameIdString}${code}`}
        value={(optionData._selectaction) ? optionSelectUri : ''}
        defaultChecked={optionDisplayName === defaultChosen || optionSelectUri === selectionValue}
      />
      <label
        htmlFor={`selectorWeight_${optionDisplayNameIdString}${code}`}
        style={{ background: optionDisplayName }}
      >
        {optionDisplayName}
      </label>
    </div>
  );
}

function SelectRequisitionListButton({
  addToRequisitionListData,
  addToRequisitionListLoading,
  availability,
  productData,
  requisitionListData,
}) {
  const dispatch = useRequisitionListCountDispatch();
  const onCountChange = (name, count) => {
    dispatch({
      type: 'COUNT_SHOW',
      payload: { count, name },
    });
    setTimeout(() => {
      dispatch({ type: 'COUNT_HIDE' });
    }, 3200);
  };

  return (
    <div className="form-content form-content-submit dropdown cart-selection-dropdown">
      <button
        className="ep-btn btn-itemdetail-addtowishlist dropdown-toggle"
        data-toggle="dropdown"
        disabled={!availability || !productData._addtowishlistform}
        type="submit"
      >
        {addToRequisitionListLoading
          ? (<span className="circularLoader" aria-label="Loading" />)
          : (<span>{intl.get('add-to-requisition-list')}</span>)
        }
      </button>
      <div className="dropdown-menu cart-selection-menu cart-selection-list">
        <ul className="cart-selection-list">
          {requisitionListData.map(list => (
            // eslint-disable-next-line
            <li
              className="dropdown-item cart-selection-menu-item"
              key={list.name || intl.get('default')}
              onClick={() => addToRequisitionListData(list, onCountChange)}
            >
              {list.name || intl.get('default')}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
