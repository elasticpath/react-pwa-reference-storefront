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

import React, { Suspense, lazy } from 'react';
import { withRouter } from 'react-router';

import Config from '../ep.config.json';

import './HomePage.scss';

const B2BHomePage = lazy(() => import(/* webpackChunkName: "b2b.home.page" */ '../components/src/B2bHomePage/b2b.home.page'));
const B2CHomePage = lazy(() => import(/* webpackChunkName: "b2c.home.page" */ '../components/src/B2cHomePage/b2c.home.page'));

const HomePage: React.FunctionComponent = () => (
  <Suspense fallback={<div />}>
    {Config.b2b.enable
      ? <B2BHomePage />
      : <B2CHomePage />
    }
  </Suspense>
);

export default withRouter(HomePage);
