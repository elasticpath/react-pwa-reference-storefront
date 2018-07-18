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
import { withRouter } from 'react-router';
import ProductListItemMain from './productlistitem.main';

const Config = require('Config');

class ProductRecommendationsDisplayMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productData: this.props.productData,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.productData.self.href !== nextProps.productData.self.href) {
      this.setState({ categoryModel: nextProps.productData });
    }
  }

  renderProducts(product, length, MaxItemsInOneCarouselView) {
    // Need to do this for all possible recommendations. Crosssell, Recommendation, Replacement, Upsell, Warranty.
    const totalCount = length;
    // const MaxItemsInOneCarouselView = MaxItemsInOneCarouselView;
    console.log(`Total items to render: ${totalCount}`);
    const maxViews = totalCount / MaxItemsInOneCarouselView;
    console.log(`Total Views created: ${maxViews}`);
    const data = [];
    for (let CurrentView = 0, CurrentItem = 0; CurrentView < maxViews; CurrentView++, CurrentItem += MaxItemsInOneCarouselView) {
      if (CurrentView == 0) {
        data.push(<div className="carousel-item active" key={(CurrentItem)}>
          {' '}
          <div className="row">
            {this.renderCarouselView(CurrentItem, totalCount, product, MaxItemsInOneCarouselView)}
          </div>
          {' '}
        </div>);
      } else {
        data.push(<div className="carousel-item " key={(CurrentItem + 1)}>
          {' '}
          <div className="row">
            {this.renderCarouselView(CurrentItem, totalCount, product, MaxItemsInOneCarouselView)}
          </div>
          {' '}
        </div>);
      }
    }

    return (
      <div>
        {data}
      </div>
    );
  }

  renderCarouselView(currentItem, totalCount, product, MaxItemsInOneCarouselView) {
    /* Renders Each View in Carousel */
    const some = MaxItemsInOneCarouselView;
    const data = [];
    if (currentItem < totalCount && product[currentItem].rel === 'element') {
      console.log(`renderView: ${currentItem}`);
      data.push(
        <div className="col-6" key={`_${Math.random().toString(36).substr(2, 9)}`}>
          <ProductListItemMain productUrl={product[currentItem].uri} />
        </div>,
      );
    }
    for (let i = 1; i < MaxItemsInOneCarouselView; i++) {
      /* Copy this section to add more items in the same carousel view */
      currentItem++;
      if ((currentItem) < totalCount && product[(currentItem)].rel === 'element') {
        console.log(`renderView: ${currentItem}`);
        data.push(
          <div className="col-6" key={`_${Math.random().toString(36).substr(2, 9)}`}>
            <ProductListItemMain productUrl={product[(currentItem)].uri} />
          </div>,
        );
      }
    }

    return data;
  }

  render() {
    const data = [];

    /* Copy this section to add Carousel to the view */
    if (this.state.productData._recommendations[0]._crosssell[0].links.length > 0) {
      var product = this.state.productData._recommendations[0]._crosssell[0].links;
      var length = this.state.productData._recommendations[0]._crosssell[0].links.length;
      console.log(this.state.productData._recommendations[0]._crosssell[0]);
      data.push(<div key={`_${Math.random().toString(36).substr(2, 9)}`}>
        <label className="control-label">
          Product Recommendations
        </label>
        <div className="col-md-12">
          <div className="carousel slide" data-ride="carousel" id="theCarousel">
            <div className="container">
              <div className="carousel-inner">
                {this.renderProducts(product, length, 2)}
              </div>
            </div>
            <a className="left carousel-control" href="#theCarousel" data-slide="prev">
              <i className="glyphicon glyphicon-chevron-left" />
            </a>
            <a className="right carousel-control" href="#theCarousel" data-slide="next">
              <i className="glyphicon glyphicon-chevron-right" />
            </a>
          </div>
        </div>
      </div>);
    }

    if (this.state.productData._recommendations[0]._replacement[0].links.length > 0) {
      var product = this.state.productData._recommendations[0]._replacement[0].links;
      var length = this.state.productData._recommendations[0]._replacement[0].links.length;
      console.log(this.state.productData._recommendations[0]._replacement[0]);
      data.push(<div key={`_${Math.random().toString(36).substr(2, 9)}`}>
        <label className="control-label">
          Product Replacements
        </label>
        <div className="col-md-12">
          <div className="carousel slide" data-ride="carousel" id="the_replacementCarousel">
            <div className="container">
              <div className="carousel-inner">
                {this.renderProducts(product, length, 2)}
              </div>
            </div>
            <a className="left carousel-control" href="#the_replacementCarousel" data-slide="prev">
              <i className="glyphicon glyphicon-chevron-left" />
            </a>
            <a className="right carousel-control" href="#the_replacementCarousel" data-slide="next">
              <i className="glyphicon glyphicon-chevron-right" />
            </a>
          </div>
        </div>
      </div>);
    }

    return (
      <div data-region="categoryBrowseRegion" style={{ display: 'block' }} key={`_${Math.random().toString(36).substr(2, 9)}`}>
        {data}
      </div>
    );
  }
}

export default withRouter(ProductRecommendationsDisplayMain);
