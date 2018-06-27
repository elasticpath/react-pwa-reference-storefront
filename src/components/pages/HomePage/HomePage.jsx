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
import AppHeaderMain from '../../ui/appheader/appheader.main.jsx';
import AppFooterMain from '../../ui/appfooter/appfooter.main.jsx';

var Config = require('Config')
// Then use in render: <span>{Config.skuImagesS3Url}</span>

class HomePage extends React.Component {
    render() {
        return (
            <div className="viewport ui-container home-ui-container" data-region="viewPortRegion" style={{ display: 'block' }}>
                <div>
                    <AppHeaderMain />
                    <div className="app-main home-contant-container" data-region="appMain" style={{ display: 'block' }}>
                        <div>
                            <div data-region="homeMainContentRegion" className="container" style={{ display: 'block' }}>
                                <div className="home-container">
                                    <div className="field-content">
                                        <h2>Commerce software that powers the next generation of digital experience</h2>
                                    </div>
                                    <div data-region="EPWidgetOne"></div>
                                </div>
                            </div>
                            <div className="sub-espot-container container">
                                <div className="home-espot-1">
                                </div>
                                <div className="home-espot-2">
                                </div>
                            </div>
                        </div>
                    </div>
                    <AppFooterMain />
                </div>
            </div>
        );
    }
}

export default HomePage;