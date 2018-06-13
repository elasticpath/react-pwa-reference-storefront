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

import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

var Config = require('Config')
// Then use in render: <span>{Config.skuImagesS3Url}</span>

class HomePage extends React.Component {
    render() {
        return (
            <div className="viewport ui-container" data-region="viewPortRegion" style={{ display: 'block' }}><div>

                <header className="app-header navbar navbar -fixed-top navbar-inverse" data-region="appHeader" style={{ display: 'block' }}><div className="container appheader-container">

                    <div className="back-button-container" style={{ display: 'block' }}><div>

                        <button type="button" className="navbar-back" data-region="backButtonRegion" data-el-label="navigation.back" onclick="window.history.back();">
                            <span className="icon"></span>
                        </button>

                    </div></div>
                    <div className="logo-container" style={{ display: 'block' }}><div>

                        <a href="https://forrester.epdemos.com/" className="cmd-home-logo">
                            <img src={require('../../images/Company-Logo-v1.png')} />
                        </a>

                    </div></div>

                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                        <span className="icon"></span>
                    </button>

                    <div className="collapse navbar-collapse">
                        <ul className="global-nav-container btn-group">
                            <li data-region="authMenuItemRegion" style={{ display: 'inline-block' }}><div className="auth-container">
                                <div className="auth-container">
                                    <button className="global-nav-link global-nav-login btn-auth-menu" data-toggle="modal" data-target="#login-modal" data-i18n="" data-el-label="global.profile">
                                        Login
      </button>
                                    <div data-region="authMainRegion" className="auth-nav-container"></div>
                                </div>


                            </div></li>
                            <li className="global-nav-cart-nav">
                                <button className="global-nav-link global-nav-cart" onclick="location.href=&#39;#mycart&#39;" data-toggle="collapse" data-target=".navbar-collapse">
                                    <span className="icon"></span></button>
                                <a className="global-nav-link" href="#mycart"></a>
                            </li>
                        </ul>

                        <div className="main-search-container" style={{ display: 'block' }}><form className="navbar-form">
                            <div className="form-group">
                                <input className="input-search header-search-input" type="text" placeholder="search" />
                            </div>
                            <button className="btn-header-search" data-toggle="collapse" data-target=".navbar-collapse"><span className="icon"></span>Search</button>
                        </form></div>


                        <div className="main-nav-container" data-region="mainNavRegion" style={{ display: 'block' }}><div>

                            <nav className="main-nav">
                                <button className="btn-main-nav-toggle btn-link-cmd" style={{ display: 'none' }}>
                                    Categories
        </button>
                                <ul className="main-nav-list nav navbar-nav" data-region="mainNavList">

                                    <li data-name="Accessories" data-el-container="category-nav-item-container">
                                        <a href="https://forrester.epdemos.com/#category/https%3A%2F%2Fforrester.epdemos.com%2Fcortex%2Fnavigations%2Fvestri%2Fsgzfmrktkrjesx2binbuku2tj5jesrkt%3D" className="nav-item" data-toggle="collapse" data-target=".navbar-collapse" title="Accessories"><span>Accessories</span></a>
                                    </li><li data-name="Mens" data-el-container="category-nav-item-container">
                                        <a href="https://forrester.epdemos.com/#category/https%3A%2F%2Fforrester.epdemos.com%2Fcortex%2Fnavigations%2Fvestri%2Fsgzvmrktkrjesx2nivhfgx2bkbiecusfjq%3D" className="nav-item" data-toggle="collapse" data-target=".navbar-collapse" title="Mens"><span>Mens</span></a>
                                    </li><li data-name="Womens" data-el-container="category-nav-item-container">
                                        <a href="https://forrester.epdemos.com/#category/https%3A%2F%2Fforrester.epdemos.com%2Fcortex%2Fnavigations%2Fvestri%2Fsg2vmrktkrjesx2mifcesrktl5avaucbkjcuy%3D" className="nav-item" data-toggle="collapse" data-target=".navbar-collapse" title="Womens"><span>Womens</span></a>
                                    </li><li data-name="Kids" data-el-container="category-nav-item-container">
                                        <a href="https://forrester.epdemos.com/#category/https%3A%2F%2Fforrester.epdemos.com%2Fcortex%2Fnavigations%2Fvestri%2Fsgzvmrktkrjesx2ljfcfgx2bkbiecusfjq%3D" className="nav-item" data-toggle="collapse" data-target=".navbar-collapse" title="Kids"><span>Kids</span></a>
                                    </li><li data-name="Addons" data-el-container="category-nav-item-container">
                                        <a href="https://forrester.epdemos.com/#category/https%3A%2F%2Fforrester.epdemos.com%2Fcortex%2Fnavigations%2Fvestri%2Fsgzfmrktkrjesx2jnzbwc4sbmrsg63tt%3D" className="nav-item" data-toggle="collapse" data-target=".navbar-collapse" title="Addons"><span>Addons</span></a>
                                    </li><li data-name="Planned Maintenance Kits" data-el-container="category-nav-item-container">
                                        <a href="https://forrester.epdemos.com/#category/https%3A%2F%2Fforrester.epdemos.com%2Fcortex%2Fnavigations%2Fvestri%2Fsg7vmrktkrjesx2qjrau4tsfirpu2qkjjzkektsbjzbukx2ljfkfg%3D" className="nav-item" data-toggle="collapse" data-target=".navbar-collapse" title="Planned Maintenance Kits"><span>Planned Maintenance Kits</span></a>
                                    </li>
                                    <li>
                                        <Link to="/products"><button>Products</button></Link>
                                    </li>
                                </ul>
                            </nav>

                        </div></div>


                    </div>


                </div></header>

                <div className="app-main" data-region="appMain" style={{ display: 'block' }}><div>
                    <div data-region="homeMainContentRegion" className="container" style={{ display: 'block' }}><div className="home-container">
                        <div className="field-content">
                            <h2>Commerce software that powers the next generation of digital experience</h2>
                        </div>
                        <div data-region="EPWidgetOne"></div>
                    </div></div>
                    <div className="sub-espot-container container">
                        <div className="home-espot-1">
                        </div>
                        <div className="home-espot-2">
                        </div>
                    </div>
                </div></div>

                <footer className="app-footer" data-region="appFooter"></footer>

            </div>

                <div id="TemplateContainer">

                    <div id="AppModuleTemplateContainer">

                        <script id="AppModuleDefaultBaseTemplate" type="text/template">

                            <header className="app-header navbar navbar -fixed-top navbar-inverse" data-region="appHeader"></header>

                            <div className="app-main" data-region="appMain"></div>

                            <footer className="app-footer" data-region="appFooter"></footer>

                        </script>

                        <script id="EPDevInstrumentationTemplate" type="text/template">
                            <button className="btn-cmd" id="BtnDevInstrumenationToggle">INSTRUMENATION</button>
                            <div id="EPDevInstrumentation">
                                <label>Keep Open
        <input type="checkbox" id="DevInstrumentationToggleCheckbox" checked="checked" />
                                </label>
                                <h2 className="ep-dev-instrumentation-header">Application</h2>
                                <table className="ep-dev-instrumentation-table">
                                    <thead>
                                        <th></th>
                                        <th></th>
                                    </thead>
                                    <tbody>

                                        <tr>
                                            <td>
                                                Pixel Density
          </td>
                                            <td id="DevInstrumentationPixelDensity"></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Touch Enabled
          </td>
                                            <td id="DevInstrumentationTouchEnabled"></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Render Profile
          </td>
                                            <td id="DevInstrumentationRenderProfile"></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Screen Width (Px)
          </td>
                                            <td id="DevInstrumentationScreenPixelWidth"></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Screen Width (REM)
          </td>
                                            <td id="DevInstrumentationScreenRemWidth"></td>
                                        </tr>



                                    </tbody>

                                </table>
                                <div data-region="EPDevAppHeaderInstrumentationContainer"></div>
                            </div>

                        </script>
                        <script id="EPDevAppHeaderInstrumentationTemplate" type="text/template">

                            <h2 className="ep-dev-instrumentation-header">App Header <button id="EPDevReloadHeaderBtn">*</button></h2>
                            <table className="ep-dev-instrumentation-table" data-region="epDevAppHeaderInstrumentationList">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>


                        </script>

                        <script id="EPDevAppHeaderInstrumentationItemTemplate" type="text/template">
                            <td>
                            </td>
                            <td id="<%= E.ElId %>"></td>
                        </script>
                    </div>

                    <div className="HomeModuleTemplateContainer">

                        <script id="DefaultHomeLayoutTemplate" type="text/template">
                            <div data-region="homeMainContentRegion" className="container">
                            </div>
                            <div className="sub-espot-container container">
                                <div className="home-espot-1">
                                </div>
                                <div className="home-espot-2">
                                </div>
                            </div>
                        </script>

                        <script id="DefaultHomeViewTemplate" type="text/template">
                            <div className="field-content">
                                <h2>Commerce software that powers the next generation of digital experience</h2>
                            </div>
                            <div data-region="EPWidgetOne"></div>
                        </script>
                    </div>

                    <div id="AppHeaderTemplateContainer">

                        <script type="text/template" id="AppHeaderDefaultTemplateContainer">

                            <div className="back-button-container">[back button template goes here]</div>

                            <div className="logo-container">[logo template goes here]</div>

                            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                                <span className="icon"></span>
                            </button>

                            <div className="collapse navbar-collapse">
                                <ul className="global-nav-container btn-group">
                                    <li data-region="authMenuItemRegion" ></li>
                                    <li className="global-nav-cart-nav">
                                        <button className="global-nav-link global-nav-cart" onclick="location.href='#mycart'" data-toggle="collapse" data-target=".navbar-collapse">
                                            <span className="icon"></span></button>
                                    </li>
                                </ul>

                                <div className="main-search-container">[main search goes here]</div>


                                <div className="main-nav-container" data-region="mainNavRegion">
                                    <div className="activity-indicator-container">
                                        <img className="activity-indicator" src="images/activity-indicator-strobe.gif" />
                                    </div>
                                </div>


                            </div>


                        </script>

                        <script id="BackButtonTemplateContainer" type="text/template">

                            <button type="button" className="navbar-back" data-region="backButtonRegion" data-el-label="navigation.back" onclick="window.history.back();">
                                <span className="icon"></span>
                            </button>

                        </script>

                        <script id="LogoTemplateContainer" type="text/template">

                            <a href="<%= E.homeUri %>" className="cmd-home-logo">
                            </a>

                        </script>



                    </div>

                    <div id="IATemplateContainer">


                        <script type="text/template" id="MainNavTemplate">

                            <nav className="main-nav">
                                <button className="btn-main-nav-toggle btn-link-cmd">
                                    Categories
        </button>
                                <ul className="main-nav-list nav navbar-nav" data-region="mainNavList">

                                </ul>
                            </nav>

                        </script>

                        <script type="text/template" id="NavItemTemplate">
                            <a href="<%= E.generateCategoryHref(E.href) %>" className="nav-item" data-toggle="collapse" data-target=".navbar-collapse" title="<%= E.displayName %>"><span></span></a>
                        </script>
                        <script id="BrowseCategoryLayoutContainer" type="text/template">
                            <h1 className="view-title"></h1>
                            <div className="row">
                                <div className="fifth" data-region="categoryRegion">categories</div>
                                <div className="fourfifth" data-region="itemRegion">
                                    <div className="activity-indicator-container">
                                        <img className="activity-indicator" src="images/activity-indicator-strobe.gif" />
                                    </div>
                                </div>
                            </div>
                        </script>

                        <script id="BrowseCategoryListTemplate" type="text/template">
                            <h2 className="browse-subtitle">Sub Categories</h2>
                            <div data-region="subCategoryListRegion">
                                <ul className="browse-subcategory-list"></ul>
                            </div>
                        </script>

                        <script data-view="IACategoryNodeView" type="text/template">
                            <a href="#" className="ia-category-node">Node Item</a>
                        </script>

                        <script id="BrowseCategoryItemTemplate" type="text/template">

                            <a href="#" className="cmd-nav-item" title="<%= E.label %>" data-route="<%= E.name %>"><span></span></a>

                        </script>

                        <script id="BrowseItemListTemplate" type="text/template">
                            <h2 className="browse-subtitle">Products</h2>
                            <div data-region="browseItemListRegion">
                                <ul className="browse-item-list"></ul>
                            </div>
                        </script>

                        <script id="NoSubCatsView" type="text/template">
                            <p></p>
                        </script>

                        <script id="BrowseItemTemplate" type="text/template">

                            <div>
                                <img src="images/img-placeholder.png" className="item-img" />
                                <div data-region="displayName"><a href="#itemdetail/<%= E.isoId %>"></a></div>
                                <div data-region="price"><a href="#itemdetail/<%= E.isoId %>"></a></div>

                            </div>

                        </script>


                    </div>


                    <div className="SearchModuleTemplateContainer">

                        <script id="SearchModuleDefaultTemplate" type="text/template">
                            <div className="form-group">
                                <input className="input-search header-search-input" type="text" placeholder="search" />
                            </div>
                            <button className="btn-header-search" data-toggle="collapse" data-target=".navbar-collapse"><span className="icon"></span>Search</button>
                        </script>

                        <script id="SearchResultsTemplate" type="text/template">
                            <h1 className="view-title">Search Results</h1>

                            <div className="search-results-inner" data-region="searchResultsList"></div>


                        </script>

                        <script id="SearchResultsLayoutContainer" type="text/template">
                            <div data-region="searchResultsRegion"></div>
                        </script>

                        <script id="SearchNoResultsTemplate" type="text/template">
                            <div className="no-results-container">No results found</div>
                        </script>

                        <script id="SearchResultsItemContainer" type="text/template">
                            <div className="search-results-item-inner">
                                <div className="category-item-thumbnail-container">
                                </div>
                                <div data-region="displayName"><a href="<%= E.generateItemHref(E.uri) %>"></a></div>
                                <div data-region="price"></div>
                                <div className="btn-container">
                                    <button className="btn-view-item-detail">View</button>
                                    <button className="btn-addtocart">Add to Cart</button>
                                </div>
                            </div>







                        </script>

                    </div>

                    <div id="AuthTemplateContainer">

                        <script id="DefaultAuthLayoutTemplate" type="text/template">
                            <div className="auth-container">
                                <button className="global-nav-link global-nav-login btn-auth-menu" data-toggle="modal" data-target="#login-modal"
                                    data-i18n="<%= E.getMenuItemText() %>" data-el-label="global.profile">
                                </button>
                                <div data-region="authMainRegion" className="auth-nav-container"></div>
                            </div>


                        </script>

                        <script id="AuthLoginFormTemplate" type="text/template">
                            <h2></h2>
                            <div className="auth-feedback-container" data-region="authLoginFormFeedbackRegion" data-i18n=""></div>

                            <form role="form" method="POST">
                                <div className="form-group">
                                    <label for="OAuthUserName"></label>
                                    <input className="form-control" id="OAuthUserName" name="OAuthUserName" type="text" autofocus="autofocus" />
                                </div>
                                <div className="form-group">
                                    <label for="OAuthPassword"></label>
                                    <input className="form-control" id="OAuthPassword" name="OAuthPassword" type="password" />
                                </div>
                                <input id="OAuthScope" name="OAuthScope" list="oAuthScopeList" type="hidden" value="<%= E.getStoreScope() %>" />
                                <input id="OAuthRole" name="OAuthRole" list="oAuthRoleList" type="hidden" value="REGISTERED" />
                                <div className="form-group action-row">
                                    <div className="login-cell">
                                        <button className="btn-auth-login" data-cmd="login" data-toggle="collapse" data-target=".navbar-collapse"></button>
                                    </div>
                                    <div className="register-cell">
                                        <button className="btn-auth-register btn btn-link" data-cmd="register" data-toggle="collapse" data-target=".navbar-collapse"></button>
                                    </div>
                                </div>

                            </form>
                        </script>

                        <script id="AuthProfileMenuTemplate" type="text/template">
                            <li><a href="<%= E.getUrlHash('profile') %>" className="profile-link" data-el-label="auth.profile" data-toggle="collapse" data-target=".navbar-collapse"><span className="icon">
                            </span></a></li>
                            <li>
                                <button className="btn-cmd btn-auth-logout" data-el-label="auth.logout"><span className="icon"></span></button>
                            </li>
                        </script>

                        <script id="CheckoutAuthOptionsLayoutTemplate" type="text/template">
                            <h3></h3>
                            <div className="checkout-auth-option-list equalize">
                                <div data-region="checkoutAutRegisterOptionRegion"></div>
                                <div data-region="checkoutAuthLoginOptionRegion"></div>
                                <div data-region="checkoutAuthAnonymousOptionRegion"></div>
                            </div>
                        </script>

                        <script id="CheckoutAuthLoginOptionTemplate" type="text/template">
                            <h3></h3>

                            <form role="form" method="POST">
                                <div className="auth-feedback-container" data-region="authLoginFormFeedbackRegion"></div>

                                <div className="form-group checkout-auth-form-group">
                                    <label for="OAuthUserName" data-el-label="checkoutAuthOption.username" className="control-label">
                                        <span className="required-label">*</span>
                                    </label>
                                    <input className="form-control" id="OAuthUserName" name="OAuthUserName" type="text" autofocus="autofocus" />
                                </div>
                                <div className="form-group checkout-auth-form-group">
                                    <label for="OAuthPassword" data-el-label="checkoutAuthOption.password" className="control-label">
                                        <span className="required-label">*</span>
                                    </label>
                                    <input className="form-control" id="OAuthPassword" name="OAuthPassword" type="password" />
                                </div>
                                <input id="OAuthScope" name="OAuthScope" list="oAuthScopeList" type="hidden" value="<%= E.getStoreScope() %>" />
                                <input id="OAuthRole" name="OAuthRole" list="oAuthRoleList" type="hidden" value="REGISTERED" />
                                <button className="btn btn-primary checkout-auth-option-login-btn" data-el-label="checkoutAuthOption.login">
                                </button>
                            </form>
                        </script>

                        <script id="CheckoutAuthRegisterOptionTemplate" type="text/template">
                            <h3></h3>
                            <p></p>
                            <button className="btn btn-primary checkout-auth-option-register-btn" data-el-label="checkoutAuthOption.register">
                            </button>
                        </script>

                        <script id="CheckoutAuthAnonymousOptionTemplate" type="text/template">
                            <h3></h3>
                            <p></p>

                            <form role="form" method="POST">
                                <div className="anonymous-checkout-feedback-container" data-region="anonymousCheckoutFeedbackRegion"></div>

                                <div className="form-group checkout-auth-form-group">
                                    <label for="Email" data-el-label="checkoutAuthOption.email" className="control-label">
                                        <span className="required-label">*</span>
                                    </label>
                                    <input id="Email" name="Email" className="form-control" type="email" />
                                </div>

                                <button className="btn btn-primary checkout-auth-option-anonymous-checkout-btn" data-el-label="checkoutAuthOption.anonymousCheckout">
                                </button>
                            </form>

                        </script>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomePage;