export { BloomreachKeywordSearchLookupResponse } from '../../utils/Bloomreach/types/BloomreachSearchService';

export interface BloomreachSearchResultsItemsMainProps {
    searchKeywordsProps: {
      [key: string]: any
    },
    onProductFacetSelection?: (...args: any[]) => any,
    productLinks?: {
      [key: string]: string
    }
  }
  
export interface BloomreachSearchResultsItemsMainState {
    isLoading: boolean,
    searchResultsModel: {
      [key: string]: any
    },
    loadSortedProduct: boolean,
    searchKeywords: any,
    searchQueryParams: any,
}