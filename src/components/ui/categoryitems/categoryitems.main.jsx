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
import { login } from '../../../utils/AuthService.js';
import ProductListItemMain from '../productlistitem/productlistitem.main.jsx';
import ProductListMain from '../productlist/productlist.main.jsx';
import ProductListPaginationTop from '../productlistpaginationtop/productlistpaginationtop.main.jsx';
import ProductListPaginationBottom from '../productlistpaginationbottom/productlistpaginationbottom.main.jsx';

var Config = require('Config')

class CategoryItemsMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryModel: { links: [] },
            selfHref: '',
        };
    }
    componentWillReceiveProps(nextProps) {
        if (this.state.selfHref !== nextProps.categoryUrl) {
            login().then(() => {
                fetch(nextProps.categoryUrl + '?zoom=items',
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem(Config.cortexApi.scope + '_oAuthToken')
                        }
                    })
                    .then(res => res.json())
                    .then(res => {
                        this.setState({
                            selfHref: nextProps.categoryUrl,
                            prevSelfHref: this.state.selfHref,
                            categoryModel: res
                        });
                    })
                    .catch(error => {
                        console.log(error)
                    });
            });
        }
    }
    componentDidMount() {
        login().then(() => {
            fetch(this.props.categoryUrl + '?zoom=items',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem(Config.cortexApi.scope + '_oAuthToken')
                    }
                })
                .then(res => res.json())
                .then(res => {
                    this.setState({
                        categoryModel: res,
                        selfHref: this.props.categoryUrl
                    });
                })
                .catch(error => {
                    console.log(error)
                });
        });
    }
    render() {
        if (this.state.categoryModel.links.length > 0) {
            return (
                <div className="category-items-container container">
                    <div data-region="categoryTitleRegion" style={{ display: 'block' }}>
                        <div>
                            <h1 className="view-title">{this.state.categoryModel["display-name"]}</h1>
                        </div>
                    </div>
                    <ProductListMain productData={this.state.categoryModel["_items"] ? this.state.categoryModel["_items"][0] : this.state.categoryModel}/>
                </div>
            );
        }
        else {
            return (<span>Loading or No Products Found...</span>)
        }
    }
}

export default CategoryItemsMain;