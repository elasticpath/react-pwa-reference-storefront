
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

var paginationPreviousLinkVar = '';
var paginationNextLinkVar = '';

class ProductListPaginationTop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paginationData: this.props.paginationData,
            paginationPreviousLink: '',
            paginationNextLink: '',
            selfHref: this.props.categoryUrl,
            prevSelfHref: ''
        };
    }
    componentWillReceiveProps(nextProps) {
        paginationPreviousLinkVar = '';
        paginationNextLinkVar = '';
        for (var i = 0; i < nextProps.paginationData.links.length; i++) {
            if (nextProps.paginationData.links[i].rel === "previous") {
                paginationPreviousLinkVar = nextProps.paginationData.links[i].href

            }
            if (nextProps.paginationData.links[i].rel === "next") {
                paginationNextLinkVar = nextProps.paginationData.links[i].href
            }
        }
        this.setState({
            paginationData: nextProps.paginationData,
            paginationPreviousLink: paginationPreviousLinkVar,
            paginationNextLink: paginationNextLinkVar
        });
    }
    componentDidMount() {
        paginationPreviousLinkVar = '';
        paginationNextLinkVar = '';
        for (var i = 0; i < this.state.paginationData.links.length; i++) {
            if (this.state.paginationData.links[i].rel === "previous") {
                paginationPreviousLinkVar = this.state.paginationData.links[i].href

            }
            if (this.state.paginationData.links[i].rel === "next") {
                paginationNextLinkVar = this.state.paginationData.links[i].href
            }
        }
        this.setState({
            paginationData: this.state.paginationData,
            paginationPreviousLink: paginationPreviousLinkVar,
            paginationNextLink: paginationNextLinkVar
        });
    }
    render() {
        if (this.state.paginationData.links.length > 0) {
            return (
                <div data-region="categoryPaginationTopRegion" style={{ display: 'block' }}>
                    <div className="pagination-container">
                        <div className="paging-total-results">
                            <span className="pagination-value pagination-total-results-value">{this.state.paginationData.pagination.results}</span>
                            <label className="pagination-label pagination-total-results-label">&nbsp;results&nbsp;</label>
                            (&nbsp;<span className="pagination-value pagination-results-displayed-value">{this.state.paginationData.pagination["results-on-page"]}</span>
                            <label className="pagination-label">&nbsp;results on page</label> )
                        </div>
                        {this.state.paginationNextLink !== '' || this.state.paginationPreviousLink !== '' ?
                            <div className="pagination-navigation-container">
                                {this.state.paginationPreviousLink !== '' ?
                                    <Link to={"/category/" + encodeURIComponent(this.state.paginationPreviousLink)} className="btn-pagination btn-pagination-prev pagination-link pagination-link-disabled" id="category_items_listing_pagination_previous_top_link" role="button"><span className="icon"></span>Previous</Link>
                                    : ("")}
                                <span className="pagestate-summary">
                                    <label className="pagination-label">page&nbsp;</label>
                                    <span className="pagination-value pagination-curr-page-value">{this.state.paginationData.pagination.current}</span>
                                    <label className="pagination-label">&nbsp;of&nbsp;</label>
                                    <span className="pagination-value pagination-total-pages-value">{this.state.paginationData.pagination.pages}</span>
                                </span>
                                {this.state.paginationNextLink !== '' ?
                                    <Link to={"/category/" + encodeURIComponent(this.state.paginationNextLink)} className="btn-pagination btn-pagination-next pagination-link pagination-link-disabled" id="category_items_listing_pagination_next_top_link" role="button">Next<span className="icon"></span></Link>
                                    : ("")}
                            </div>
                            : ("")}
                    </div>
                </div>);
        }
        else {
            return (<div className="loader"></div>)
        }
    }
}

export default ProductListPaginationTop;