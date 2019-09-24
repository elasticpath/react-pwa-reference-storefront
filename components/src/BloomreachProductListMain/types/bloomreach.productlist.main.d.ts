export interface BloomreachProductListMainProps {
    productData: [],
    showCompareButton: boolean
  }
  
export interface BloomreachProductListMainState {
    isCompare: boolean,
    compareLink: string,
    categoryModel: {[key: string]: any},
    compareList: any,
}
