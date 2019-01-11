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
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import { navigationLookup } from '../utils/CortexLookup';
import { login } from '../utils/AuthService';

import './productlistloadmore.less';

class ProductListLoadMore extends React.Component {
  static propTypes = {
    dataProps: PropTypes.objectOf(PropTypes.any).isRequired,
    handleDataChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const nextLink = props.dataProps.links.find(link => link.rel === 'next');
    this.state = {
      canLoadMore: Boolean(nextLink),
      isLoading: false,
    };

    this.loadMore = this.loadMore.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const nextLink = nextProps.dataProps.links.find(link => link.rel === 'next');
    this.setState({ canLoadMore: Boolean(nextLink) });
  }

  loadMore() {
    const { dataProps, handleDataChange } = this.props;
    this.setState({ isLoading: true });
    login().then(() => {
      const nextRel = dataProps.links.find(link => link.rel === 'next');
      if (nextRel) {
        navigationLookup(nextRel.uri)
          .then((res) => {
            const { _element, links, pagination } = dataProps;
            const updatedLinks = links.filter(link => link.rel === 'element');
            const resultsOnPage = pagination['results-on-page'] + res.pagination['results-on-page'];
            const updatedPagination = pagination;
            updatedPagination['results-on-page'] = resultsOnPage;
            const updatedItems = {
              links: updatedLinks.concat(res.links),
              messages: res.messages,
              pagination: updatedPagination,
              self: res.self,
              _element: _element.concat(res._element),
            };
            handleDataChange(updatedItems);
            this.setState({ isLoading: false });
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error.message);
          });
      }
    });
  }

  render() {
    const { canLoadMore, isLoading } = this.state;
    const nextBtn = (
      <button className="ep-btn primary wide btn-load-more" type="button" onClick={() => { this.loadMore(); }}>
        {intl.get('load-more')}
      </button>
    );

    return [
      <div className="product-list-load-more-component" key="load-more">
        {canLoadMore && !isLoading ? nextBtn : ''}
        {isLoading ? (<div className="loader" />) : ''}
      </div>,
    ];
  }
}

export default withRouter(ProductListLoadMore);
