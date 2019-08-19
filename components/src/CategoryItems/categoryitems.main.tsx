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
import * as cortex from '@elasticpath/cortex-client';
import { login } from '../utils/AuthService';
import { navigationLookup } from '../utils/CortexLookup';
import { cortexFetch } from '../utils/Cortex';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import ProductListMain from '../ProductList/productlist.main';
import SearchFacetNavigationMain from '../SearchFacetNavigation/searchfacetnavigation.main';
import FeaturedProducts from '../FeaturedProducts/featuredproducts.main';
import ProductListPagination from '../ProductListPagination/productlistpagination.main';
import ProductListLoadMore from '../ProductListLoadmore/productlistloadmore';
import { ClientContext } from '../ClientContext';

import './categoryitems.main.less';
import SortProductMenu from '../SortProductMenu/sortproductmenu.main';

let Config: IEpConfig | any = {};
let intl = { get: str => str };

const zoomArray = [
  'chosen',
  'chosen:description',
  'offersearchresult',
  'offersearchresult:element',
  'offersearchresult:element:availability',
  'offersearchresult:element:definition',
  'offersearchresult:element:price',
  'offersearchresult:element:rate',
  'offersearchresult:element:code',
  'offersearchresult:element:pricerange',
  'offersearchresult:element:items',
  'offersearchresult:element:items:element',
  'offersearchresult:element:items:element:availability',
  'offersearchresult:element:items:element:definition',
  'offersearchresult:element:items:element:price',
  'offersearchresult:element:items:element:rate',
  'offersearchresult:element:items:element:code',
  'offersearchresult:facets',
  'offersearchresult:facets:element',
  'offersearchresult:facets:element:facetselector',
  'offersearchresult:facets:element:facetselector:choice:description',
  'offersearchresult:facets:element:facetselector:choice:selector',
  'offersearchresult:facets:element:facetselector:choice:selectaction',
  'offersearchresult:facets:element:facetselector:chosen:description',
  'offersearchresult:facets:element:facetselector:chosen:selector',
  'offersearchresult:facets:element:facetselector:chosen:selectaction',
  'offersearchresult:sortattributes',
  'offersearchresult:sortattributes:choice',
  'offersearchresult:sortattributes:choice:description',
  'offersearchresult:sortattributes:choice:selectaction',
  'offersearchresult:sortattributes:chosen',
  'offersearchresult:sortattributes:chosen:description',
  'offersearchresult:sortattributes:chosen:selectaction',
];
interface CategoryItemsMainProps {
    categoryProps: {
        [key: string]: any
    },
    onProductFacetSelection?: (...args: any[]) => any,
    productLinks?: {
        [key: string]: any
    },
}
interface CategoryItemsMainState {
    isLoading: boolean,
    categoryModel: any,
    loadSortedProduct: boolean,
    categoryModelDisplayName: any,
    categoryModelParentDisplayName: any,
    categoryModelId: any,
}
class CategoryItemsMain extends React.Component<CategoryItemsMainProps, CategoryItemsMainState> {
  static contextType = ClientContext;

  static defaultProps = {
    onProductFacetSelection: () => {},
    productLinks: {
      itemDetail: '',
      productsCompare: '',
      productSearch: '',
      productCategory: '',
    },
  };

  client: cortex.IClient;

  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    ({ intl } = epConfig);
    this.state = {
      isLoading: true,
      categoryModel: { links: [] },
      loadSortedProduct: false,
      categoryModelDisplayName: undefined,
      categoryModelParentDisplayName: undefined,
      categoryModelId: undefined,
    };

    this.handleProductsChange = this.handleProductsChange.bind(this);
    this.handleSortSelection = this.handleSortSelection.bind(this);
    this.handleFacetSelection = this.handleFacetSelection.bind(this);
  }

  componentDidMount() {
    this.client = this.context;
    const { categoryProps } = this.props;
    this.getCategoryData(categoryProps);
  }

  componentWillReceiveProps(nextProps) {
    const { categoryProps } = nextProps;
    this.getCategoryData(categoryProps);
  }

  async getCategoryData(categoryProps) {
    this.setState({ isLoading: true });
    let categoryId = categoryProps.match.params;
    if (!categoryId['0'] || categoryId['0'] === undefined) {
      categoryId = categoryProps.match.params.id;
    } else {
      categoryId = categoryProps.match.params.id;
    }

    const dataCode = {
      code: categoryId,
    };
    try {
      const navigationLookupFormRes = await this.client.root().fetch({ lookups: { navigationlookupform: {} } });
      const categoryDataRes = await navigationLookupFormRes.lookups.navigationlookupform(dataCode).fetch({
        items: {
          element: {
            code: {},
            availability: {},
            definition: {
              // assets: {
              //   element: {},
              // },
            },
            price: {},
            // rate: {},
          },
        },
        offers: {
          element: {
            code: {},
            availability: {},
            definition: {
              // assets: {
              //   element: {},
              // },
            },
            pricerange: {},
            items: {
              element: {
                availability: {},
                definition: {
                  // assets: {
                  //   element: {},
                  // },
                },
                price: {},
                // rate: {},
                code: {},
              },
            },
            // rate: {},
          },
          facets: {
            element: {
              facetselector: {
                choice: {
                  description: {},
                  // selector: {},
                  // selectaction: {},
                },
                chosen: {
                  description: {},
                  // selector: {},
                  // selectaction: {},
                },
              },
            },
          },
          sortattributes: {
            choice: {
              description: {},
              selectaction: {},
              selector: {},
            },
            chosen: {
              description: {},
              selectaction: {},
              selector: {},
            },
            // offersearchresult: {},
          },
        },
        // element: {
        //   availability: {},
        //   definition: {
        //     assets: {
        //       element: {},
        //     },
        //   },
        //   price: {},
        //   rate: {},
        //   code: {},
        //   items: {
        //     element: {
        //       availability: {},
        //       definition: {
        //         assets: {
        //           element: {},
        //         },
        //       },
        //       price: {},
        //       rate: {},
        //       code: {},
        //     },
        //   },
        // },
        // facets: {
        //   element: {
        //     facetselector: {
        //       choice: {
        //         description: {},
        //         selector: {},
        //         selectaction: {},
        //       },
        //       chosen: {
        //         description: {},
        //         selector: {},
        //         selectaction: {},
        //       },
        //     },
        //   },
        // },
        featuredoffers: {
          element: {
            availability: {},
            definition: {
              // assets: {
              //   element: {},
              // },
            },
            // price: {},
            // rate: {},
            code: {},
            items: {
              element: {
                availability: {},
                definition: {
                  // assets: {
                  //   element: {},
                  // },
                },
                price: {},
                // rate: {},
                code: {},
              },
            },
          },
        },
        // parent: {},
        // sortattributes: {
        //   choice: {
        //     description: {},
        //     selectaction: {},
        //     selector: {},
        //   },
        //   chosen: {
        //     description: {},
        //     selectaction: {},
        //     selector: {},
        //   },
        //   offersearchresult: {},
        // },
      });
      this.setState({
        categoryModel: categoryDataRes,
        categoryModelDisplayName: categoryDataRes.displayName,
        // categoryModelParentDisplayName: res.parent ? res.parent[0].displayName : '',
        categoryModelId: categoryId,
      });
      const { categoryModel } = this.state;
      const productNode = (categoryModel.offers) ? ('offers') : ('items');
      this.setState(prevState => ({
        categoryModel: {
          ...prevState.categoryModel,
          [productNode]: [categoryDataRes],
        },
        isLoading: false,
      }));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error.message);
    }
  }

  handleSortSelection(event) {
    const { categoryModel } = this.state;
    const selfUri = event.target.value;
    this.setState({
      loadSortedProduct: true,
    });
    login().then(() => {
      cortexFetch(`${selfUri}?followlocation&zoom=${zoomArray.sort().join()}`,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
        .then(res => res.json())
        .then((res) => {
          const productNode = (categoryModel.offers) ? ('offers') : ('items');
          this.setState(prevState => ({
            categoryModel: {
              ...prevState.categoryModel,
              [productNode]: [res.offersearchresult[0]],
            },
            loadSortedProduct: false,
          }));
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
          this.setState({
            loadSortedProduct: false,
          });
        });
    });
  }

  handleProductsChange(products) {
    const { categoryModel } = this.state;
    const productNode = (categoryModel.offers && categoryModel.offers.elements) ? ('offers') : ('items');
    this.setState(prevState => ({
      categoryModel: {
        ...prevState.categoryModel,
        [productNode]: [products],
      },
    }));
  }

  handleFacetSelection(res) {
    const { categoryModelId } = this.state;
    const { onProductFacetSelection } = this.props;
    onProductFacetSelection(res, categoryModelId);
  }

  render() {
    const {
      isLoading, categoryModel, categoryModelId, categoryModelDisplayName, categoryModelParentDisplayName, loadSortedProduct,
    } = this.state;
    const { productLinks } = this.props;
    let products: { [key: string]: any } = {};
    let productList = '';
    let noProducts = true;
    let featuredOffers = {};
    if (categoryModel.offers && categoryModel.offers.elements) {
      products = categoryModel.offers;
      productList = categoryModel.offers;
    } else {
      products = categoryModel.items && categoryModel.items.elements ? categoryModel.items : categoryModel;
      productList = categoryModel.items && categoryModel.items.elements ? categoryModel.items : categoryModel;
    }

    if (categoryModel.featuredoffers) {
      [featuredOffers] = categoryModel.featuredoffers;
    }
    const categoryModelIdString = categoryModelId;
    noProducts = !products || !products.elements || !products.pagination;
    console.log('isLoading', isLoading);

    return (
      <div className="category-items-container container-3">
        <div data-region="categoryTitleRegion">
          {(() => {
            if (isLoading) {
              return (<div className="loader" />);
            }

            if (noProducts) {
              return (
                <h3 className="view-title">
                  {intl.get('no-products-found')}
                </h3>
              );
            }

            return (
              <div>
                <div className="menu-history">
                  {categoryModelParentDisplayName}
                  {categoryModelParentDisplayName && (
                    <span className="arrow">
                      &nbsp;﹥&nbsp;
                    </span>
                  )}
                  {categoryModelDisplayName}
                  <h1 className="category-title">
                    {categoryModelDisplayName}
                  </h1>
                </div>
                <SearchFacetNavigationMain productData={products} onFacetSelection={this.handleFacetSelection} />
                <div className="products-container">
                  <FeaturedProducts productData={featuredOffers} itemDetailLink={productLinks.itemDetail} />
                  <SortProductMenu handleSortSelection={this.handleSortSelection} categoryModel={categoryModel} />
                  <ProductListPagination paginationDataProps={products} titleString={categoryModelIdString} isTop productListPaginationLinks={productLinks} />
                  <div className={`${loadSortedProduct ? 'loading-product' : ''}`}>
                    <div className={`${loadSortedProduct ? 'sort-product-loader' : ''}`} />
                    <ProductListMain productData={productList} productListLinks={productLinks} />
                  </div>
                  <ProductListLoadMore dataProps={products} handleDataChange={this.handleProductsChange} onLoadMore={navigationLookup} />
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    );
  }
}

export default CategoryItemsMain;
