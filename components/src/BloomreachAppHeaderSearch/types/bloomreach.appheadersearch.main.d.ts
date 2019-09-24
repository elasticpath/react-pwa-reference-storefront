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

export interface BloomreachSearchSuggestionResponse {
  responseHeader: {
    status: number;
    QTime: number;
  }
  response: {
    q: string;
    suggestions: BloomreachSuggestion[];
    numFound: number;
    products: [{
      url: string;
      // eslint-disable-next-line
      sale_price: number;
      pid: string;
      // eslint-disable-next-line
      thumb_image: string;
      title: string;
    }];
  };
}
