import { BloomreachSuggestion } from '../../utils/Bloomreach/types/BloomreachSearchService';

export interface BloomreachHeaderSearchMainProps {
    isMobileView: boolean,
    isFocused: boolean,
    onSearchPage?: (...args: any[]) => any,
}

export interface BloomreachHeaderSearchMainState {
    keywords: string,
    suggestions: BloomreachSuggestion[],
}