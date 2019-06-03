import React from 'react';
import * as cortex from '@elasticpath/cortexjs';
import './ProductItem.less';

interface ProductItemProps {
  productId: string;
}

interface ProductItemState {
  isLoading: boolean;
  product?: cortex.ProductItem;
}

export class ProductItem extends React.Component<ProductItemProps, ProductItemState> {
  constructor(props: any, ...rest: any[]) {
    super(props, ...rest);

    this.state = {
      isLoading: false
    };
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    const product = await cortex.loadProductItem(this.props.productId);
    this.setState({ isLoading: false, product });
  }

  render() {
    return (
      <div className="product-item-component">
        {this.state.isLoading && (
          <span>Loading...</span>
        )}
        {this.state.product && (
          <div className="product-container">
            <span className="name">{this.state.product.name}</span>
            {' '}
            <span className="price">{this.state.product.price}</span>
          </div>
        )}
      </div>
    );
  }
}
