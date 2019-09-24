import { Value } from "aws-sdk/clients/s3";

export interface BloomreachSearchFacetNavigationMainProps {
    productData: {},
    titleString: {keywords:string},
    categoryMap: {},
    currentFacets: {},
    onFacetSelected: (queryParams: {}) => void,
    history: any,
}

export interface BloomreachSearchResultsNavigationMainState {
    facetModel: {},
    currentFacets: {},
    categoryMap: {},
}
