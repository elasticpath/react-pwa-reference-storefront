export interface BloomreachProductListMainProps {
    productData: any[],
    showCompareButton: boolean
  }
  
export interface BloomreachProductListMainState {
    isCompare: boolean,
    compareLink: string,
    categoryModel: {[key: string]: any},
    compareList: any,
}
