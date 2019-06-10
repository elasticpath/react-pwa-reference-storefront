import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';

import purchaseDetail from "./MockHttpResponses/cart_data_response";
import SearchFacetNavigationMain from "./searchfacetnavigation.main";

function handleFacetSelection(){}

storiesOf('SearchFacetNavigationMain', module)
    .addDecorator(story => (
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ))
    .add('SearchFacetNavigationMain', () => <SearchFacetNavigationMain onFacetSelection={handleFacetSelection} productData={purchaseDetail} />);
