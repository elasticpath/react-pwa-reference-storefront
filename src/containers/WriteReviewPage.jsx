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
import queryString from 'query-string';
import ReactRouterPropTypes from 'react-router-prop-types';
import '../components/powerreviews.less';

const Config = require('Config');

class WriteReview extends React.Component {
  static propTypes = {
    location: ReactRouterPropTypes.location.isRequired,
  }

  componentDidMount() {
    const { location } = this.props;
    const url = location.search;
    const params = queryString.parse(url);

    const productCode = params.pr_page_id;

    // eslint-disable-next-line no-undef
    POWERREVIEWS.display.render({
      api_key: Config.PowerReviews.api_key,
      locale: 'en_US',
      merchant_group_id: Config.PowerReviews.merchant_group_id,
      merchant_id: Config.PowerReviews.merchant_id,
      review_wrapper_url: '/write-a-review/',
      page_id: productCode,
      components: {
        Write: 'pr-write',
      },
    });
  }

  render() {
    return (<div id="pr-write" />);
  }
}

export default WriteReview;
