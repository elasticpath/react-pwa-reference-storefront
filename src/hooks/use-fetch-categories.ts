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

import { useState, useEffect } from 'react';
import { useAuthHeader, useUserTraits } from './store';
import Config from '../ep.config.json';


const zoom = [
  'navigations:element',
  'navigations:element:child',
  'navigations:element:child:child',
  'navigations:element:child:child:child',
  'navigations:element:child:child:child:child',
];

export interface CategoryResult {
  name: string;
  displayName: string;
  children: CategoryResult[];
}

function parseCategory(e: any): CategoryResult {
  return {
    name: e.name,
    displayName: e['display-name'],
    children: e._child?.map?.((c: any) => parseCategory(c)) || [],
  };
}

export async function fetchCategories(authHeader: string, userTraits: string): Promise<CategoryResult[]> {
  const response = await fetch(`${Config.cortexApi.path}/?zoom=${zoom.join(',')}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
      'x-ep-user-traits': userTraits,
    },
  });

  const result = await response.json();
  const categories: CategoryResult[] = result._navigations?.[0]?._element?.map?.((e: any) => parseCategory(e)) || [];

  return categories;
}

export interface UseFetchCategoriesResult {
  isLoading: boolean;
  error: any;
  categories: CategoryResult[];
}

export function useFetchCategories() {
  const [result, setResult] = useState<UseFetchCategoriesResult>({
    isLoading: true,
    error: null,
    categories: null,
  });

  const authHeader = useAuthHeader();
  const userTraits = useUserTraits();

  useEffect(() => {
    let isCurrent = true;

    setResult({ isLoading: true, error: null, categories: null });

    if (authHeader) {
      fetchCategories(authHeader, userTraits)
        .then((categoriesResult) => {
          if (isCurrent) {
            setResult({ isLoading: false, error: null, categories: categoriesResult });
          }
        })
        .catch((err) => {
          if (isCurrent) {
            setResult({ isLoading: false, error: err, categories: null });
          }
        });
    }

    return () => {
      isCurrent = false;
    };
  }, [authHeader, userTraits]);

  return result;
}
