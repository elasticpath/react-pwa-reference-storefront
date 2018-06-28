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

import home_espot_main from '../../../style/images/Hero-Image-v2.jpg';
import home_espot1 from '../../../style/images/VESTRI_CR-550_Banner.jpeg';
import home_espot2 from '../../../style/images/VESTRI_M-CLASS_3_Banner.jpeg';
import home_espot3 from '../../../style/images/VESTRI_X-CLASS_EL2_Banner.jpeg';

class HomePage extends React.Component {
    render() {
        return (
            <div className="viewport ui-container home-ui-container" data-region="viewPortRegion" style={{ display: 'block' }}>
                <div>
                    <AppHeaderMain />
                    <div className="home-contant-container" style={{ display: 'block' }}>
                        <div>
                            <div data-region="homeMainContentRegion" className="home-espot-container container" style={{ display: 'block' }}>
                                <img className="home-espot-1" src={home_espot_main} />
                            </div>
                            <div className="home-sub-espot-container1 container">
                                <img className="home-espot-2" src={home_espot1} />
                                <img className="home-espot-3" src={home_espot2} />
                            </div>
                            <div data-region="homeMainContentRegion" className="home-sub-espot-container2 container" style={{ display: 'block' }}>
                                <img className="home-espot-4" src={home_espot3} />
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