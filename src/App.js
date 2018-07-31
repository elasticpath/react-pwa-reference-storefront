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
import { BrowserRouter as Router, Route } from 'react-router-dom';

import router from './routes';

// eslint-disable-next-line react/no-array-index-key
const routeComponents = router.map(({ path, component }, key) => <Route exact path={path} component={component} key={key} />);

function App() {
  return (
    <Router>
      <div id="root_router_div">
        {routeComponents}
      </div>
    </Router>
  );
}

export default App;
