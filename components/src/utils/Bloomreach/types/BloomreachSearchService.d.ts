export interface BloomreachKeywordSearchLookupResponse {
    response:     Response;
    facet_counts: FacetCounts;
    category_map: CategoryMap;
    did_you_mean: any[];
}

interface CategoryMap {
    VESTRI_BM_APPAREL:   string;
    VESTRI_APPAREL_MENS: string;
}

interface FacetCounts {
    facet_ranges:  Facet;
    facet_fields:  FacetFields;
    facet_queries: Facet;
}

interface FacetFields {
    category:     Category[];
    sizes:        AgeGroup[];
    brand:        any[];
    colors:       AgeGroup[];
    color_groups: any[];
    color:        AgeGroup[];
    gender:       AgeGroup[];
    material:     AgeGroup[];
    apparel_type: AgeGroup[];
    age_group:    AgeGroup[];
}

interface AgeGroup {
    count: number;
    name:  string;
}

interface Category {
    count:     number;
    crumb:     string;
    cat_name:  string;
    parent:    string;
    cat_id:    string;
    tree_path: string;
}

interface Facet {
}

interface Response {
    numFound: number;
    start:    number;
    docs:     Doc[];
}

interface Doc {
    sale_price:       number;
    price:            number;
    description:      string;
    title:            string;
    url:              string;
    brand:            string;
    pid:              string;
    thumb_image:      string;
    sale_price_range: number[];
    price_range:      number[];
    variants:         Variant[];
}

interface Variant {
    sku_swatch_images: string[];
    sku_thumb_images:  string[];
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
