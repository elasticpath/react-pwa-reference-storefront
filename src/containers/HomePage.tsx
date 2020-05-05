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


let B2BHomePage = null;
let B2CHomePage = null;

if (Config.b2b.enable) {
  const B2BHomePageImport = import(/* webpackChunkName: "b2b.home.page" */ '../components/src/B2bHomePage/b2b.home.page');
  B2BHomePage = lazy(() => B2BHomePageImport);
} else {
  const B2CHomePageImport = import(/* webpackChunkName: "b2c.home.page" */ '../components/src/B2cHomePage/b2c.home.page');
  B2CHomePage = lazy(() => B2CHomePageImport);
}

const HomePage: React.FunctionComponent = () => (
  <Suspense fallback={<div />}>
    {B2BHomePage
      ? <B2BHomePage />
      : <B2CHomePage />
    }
  </Suspense>
);

export default withRouter(HomePage);
