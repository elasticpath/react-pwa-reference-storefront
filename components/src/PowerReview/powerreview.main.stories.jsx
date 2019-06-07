import React from 'react';
import {storiesOf} from '@storybook/react';
import productData from './MockHttpResponses/product_data_cortex_response';

import PowerReview from "./powerreview.main";

storiesOf('PowerReview', module)
    .add('PowerReview', () => <PowerReview productData={productData} />);
