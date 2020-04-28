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
import {
  HomePage,
  ProductDetailPage,
  CategoryPage,
} from './containers/container_exports/base_containers';

export default function b2cRoutes() {
  return [{
    path: '/',
    exact: true,
    component: HomePage,
  }, {
    path: '/itemdetail',
    exact: true,
    component: ProductDetailPage,
  }, {
    path: '/itemdetail/:url',
    component: ProductDetailPage,
  }, {
    path: '/category',
    exact: true,
    component: CategoryPage,
  }, {
    path: '/category/:id',
    exact: true,
    component: CategoryPage,
  }, {
    path: '/category/:id/*',
    exact: true,
    component: CategoryPage,
  }];
}
