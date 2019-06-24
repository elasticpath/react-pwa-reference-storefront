import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';

import purchaseDetail from "./MockHttpResponses/cart_data_response";
import ReorderMain from "./reorder.main";

function handleReorderAll(){}
const itemDetailLink = '';

storiesOf('ReorderMain', module)
    .addDecorator(story => (
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ))
    .add('ReorderMain', () => <ReorderMain productsData={purchaseDetail} onReorderAll={handleReorderAll} itemDetailLink={itemDetailLink} />);
