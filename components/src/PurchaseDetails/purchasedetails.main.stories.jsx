import React from 'react';
import {storiesOf} from '@storybook/react';

import PurchaseDetailsMain from "./purchasedetails.main";
import purchaseDetail from "./MockHttpResponses/purchase_detail_response";

function handleReorderAllProducts(){}
const itemDetailLink = '/';

storiesOf('PurchaseDetailsMain', module)
    .add('PurchaseDetailsMain', () => <PurchaseDetailsMain data={purchaseDetail} onReorderAllProducts={handleReorderAllProducts} itemDetailLink={itemDetailLink} />);
