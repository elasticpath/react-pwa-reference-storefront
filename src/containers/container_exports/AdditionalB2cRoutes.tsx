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
import routes from './additionalB2cRouter';
import RouteWithSubRoutes from '../../RouteWithSubRoutes';

const AdditionalB2cRoutes = () => (
  <div>
    {routes.map(route => (
      <RouteWithSubRoutes key={route.path} {...route} />
    ))}
  </div>
);

export default AdditionalB2cRoutes;
