/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
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
 */
var config = {
  baseDependencyConfig: {
    paths: {
      'backbone': 'scripts/lib/backbone',
      'bootstrap': 'scripts/lib/bootstrap.min',
      'equalize': 'scripts/lib/plugins/jquery-equalheights',
      'i18n': 'scripts/lib/i18next.amd-1.7.2',
      'jquery': 'scripts/lib/jquery-1.8.3',
      'jsonpath': 'scripts/lib/jsonpath-0.8.0',
      'marionette': 'scripts/lib/backbone.marionette',
      'modalwin': 'scripts/lib/plugins/jquery.simplemodal-1.4.4',
      'modernizr': 'scripts/lib/modernizr-latest',
      'pace': 'scripts/lib/pace.min',
      'spin': 'scripts/lib/plugins/spin',
      'jquerySpin': 'scripts/lib/plugins/jquery.spin',
      'toast': 'scripts/lib/plugins/jquery.toastmessage',
      'underscore': 'scripts/lib/underscore',
      'URI': 'scripts/lib/URI',   // used by Cortex module only, remove after redo search

      'ep': 'ep.client',
      'eventbus': 'eventbus',
      'loadRegionContentEvents': 'loadRegionContentEvents',
      'mediator': 'ep.mediator',
      'modelHelpers': 'helpers/model.helpers',
      'router': 'router',
      'viewHelpers': 'helpers/view.helpers',
      'utils': 'utils/utils',

     'cortex': 'modules/base/cortex/base.cortex.controller', // used by Search module only, remove after redo search
      'app': 'modules/base/app/base.app.controller',
      'app.models': 'modules/base/app/base.app.models',
      'app.views': 'modules/base/app/base.app.views',
      'appheader': 'modules/base/appheader/base.appheader.controller',
      'appheader.models': 'modules/base/appheader/base.appheader.models',
      'appheader.views': 'modules/base/appheader/base.appheader.views',
      'auth': 'modules/base/auth/base.auth.controller',
      'auth.models': 'modules/base/auth/base.auth.models',
      'auth.views': 'modules/base/auth/base.auth.views',
      'cart': 'modules/base/cart/base.cart.controller',
      'cart.models': 'modules/base/cart/base.cart.models',
      'cart.views': 'modules/base/cart/base.cart.views',
      'checkout': 'modules/base/checkout/base.checkout.controller',
      'checkout.models': 'modules/base/checkout/base.checkout.models',
      'checkout.views': 'modules/base/checkout/base.checkout.views',
      'category': 'modules/base/category/base.category.controller',
      'category.models': 'modules/base/category/base.category.models',
      'category.views': 'modules/base/category/base.category.views',
      'ia': 'modules/base/ia/base.ia.controller',
      'ia.models': 'modules/base/ia/base.ia.models',
      'ia.views': 'modules/base/ia/base.ia.views',
      'item': 'modules/base/item/base.item.controller',
      'item.models': 'modules/base/item/base.item.models',
      'item.views': 'modules/base/item/base.item.views',
      'home': 'modules/base/home/base.home.controller',
      'home.models': 'modules/base/home/base.home.models',
      'home.views': 'modules/base/home/base.home.views',
      'profile': 'modules/base/profile/base.profile.controller',
      'profile.models': 'modules/base/profile/base.profile.models',
      'profile.views': 'modules/base/profile/base.profile.views',
      'purchaseinfo': 'modules/base/purchaseinfo/base.purchaseinfo.controller',
      'purchaseinfo.models': 'modules/base/purchaseinfo/base.purchaseinfo.models',
      'purchaseinfo.views': 'modules/base/purchaseinfo/base.purchaseinfo.views',
      'registration': 'modules/base/registration/base.registration.controller',
      'registration.views': 'modules/base/registration/base.registration.views',
      'search': 'modules/base/search/base.search.controller',
      'search.models': 'modules/base/search/base.search.models',
      'search.views': 'modules/base/search/base.search.views',

      'address'       : 'modules/base/components/address/base.component.address.controller',
      'address.views' : 'modules/base/components/address/base.component.address.views',
      'address.models': 'modules/base/components/address/base.component.address.models',
      'payment'       : 'modules/base/components/payment/base.component.payment.controller',
      'payment.views' : 'modules/base/components/payment/base.component.payment.views',
      'payment.models' : 'modules/base/components/payment/base.component.payment.models'
    },
    shim: {
      'backbone': {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
      },
      marionette: {
        deps: ['backbone', 'underscore', 'jquery'],
        exports: 'Marionette'
      },
      ep: {
        deps: ['jquery', 'marionette'],
        exports: 'ep'
      },
      i18n: {
        deps: ['jquery'],
        exports: 'i18n'
      },
      bootstrap: {
        deps: ['jquery'],
        exports: 'bootstrap'
      },
      'underscore': {
        'exports': '_'
      }
    }
  }

};


