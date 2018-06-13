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
 
var CACHE_NAME = 'ep-site-demo';
var urlsToCache = [
  // Don't Cache styles for now
  // '/style/style.css',
  'router.js',
  'manifest.json',
  '/helpers/view.helpers.js',
  '/base.dependency.config.js',
  '/text.js',
  '/eventbus.js',
  '/main.js',
  '/ep.mediator.js',
  '/loadRegionContentEvents.js',
  '/ep.client.js',
  '/ep.config.json',
  '/utils/utils.js',
  '/style/fonts/glyphicons-halflings-regular.woff'
];

var urlsToCacheOnLoad = [
  '/scripts/lib/',
  '/images/',
  '/locales/',
  // Don't Cache styles or modules for now
  // '/style/',
  // '/modules/base/'
];

self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// application fetch network data
self.addEventListener('fetch', event => {
  // abandon non-GET requests
  if (event.request.method !== 'GET') return;
  let url = event.request.url;
  event.respondWith(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.match(event.request).then(function (response) {
          if (response) {
            // return cached file
            console.log('cache fetch: ' + url);
            return response;
          }
          // If not match, there is no rejection but an undefined response.
          else {
            // Go to network.
            return fetch(event.request).then(function (response) {
              console.log('network fetch: ' + url);
              if (urlsToCacheOnLoad.some(substring=>response.url.includes(substring))) {
                console.log('network fetch cached: ' + url);
                cache.put(event.request, response.clone()).then(function () {
                  return response;
                });
              }
              return response;
            });
          }
        });
      })
  );
});