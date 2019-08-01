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
import queryString from 'query-string';
import scriptjs from 'scriptjs';
import { RouteComponentProps } from 'react-router-dom';
import * as UserPrefs from '../utils/UserPrefs';
import Config from '../ep.config.json';

import './WriteReviewPage.less';

const powerReviewsRemoteScriptUrl = 'http://ui.powerreviews.com/stable/4.0/ui.js';

class WriteReview extends React.Component<RouteComponentProps> {
  private POWERREVIEWS: any;

  componentDidMount() {
    const { location } = this.props;
    const url = location.search;
    const params = queryString.parse(url);
    const productCode = params.pr_page_id;

    scriptjs(powerReviewsRemoteScriptUrl, () => {
    // eslint-disable-next-line no-undef
      this.POWERREVIEWS.display.render({
        api_key: Config.PowerReviews.api_key,
        locale: UserPrefs.getSelectedLocaleValue().replace('-', '_'),
        merchant_group_id: Config.PowerReviews.merchant_group_id,
        merchant_id: Config.PowerReviews.merchant_id,
        review_wrapper_url: '/write-a-review/',
        page_id: productCode,
        components: {
          Write: 'pr-write',
        },
      });
    });
  }

  render() {
    return (<div id="pr-write" />);
  }
}

export default WriteReview;
