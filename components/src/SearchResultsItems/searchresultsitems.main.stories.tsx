import React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';

import SearchResultsItemsMain from './searchresultsitems.main';

import { mockSearchResults } from './searchresultsitems.main.mock.api';

function handleProductFacetSelection(){}
const props = {
    match: {
        isExact: true,
        params: {
            keywords: "x-class",
        }
    }
};
const productLinks = {};

storiesOf('SearchResultsItemsMain', module)
    .addDecorator(story => (
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ))
    .add('SearchResultsItemsMain', () => {
        mockSearchResults();
        return <SearchResultsItemsMain
            searchKeywordsProps={props}
            onProductFacetSelection={handleProductFacetSelection}
            productLinks={productLinks}
        />
    });
