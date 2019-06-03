
export interface ProductItem {
  name: string;
  price: number;
}

export async function loadProductItem(productId: string): Promise<ProductItem> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        name: 'Blue Shirt',
        price: 12.34
      });
    }, 1000);
  });
}
