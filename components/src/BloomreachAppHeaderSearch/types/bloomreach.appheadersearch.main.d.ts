export { BloomreachSearchSuggestionResponse } from '../../utils/Bloomreach/BloomreachSearchService'

export interface BloomreachHeaderSearchMainProps {
    isMobileView: boolean,
    isFocused: boolean,
    onSearchPage?: (...args: any[]) => any,
}

export interface BloomreachSuggestion {
  q: string,
  dq: string,
}

export interface BloomreachHeaderSearchMainState {
    keywords: string,
    suggestions: BloomreachSuggestion[],
}