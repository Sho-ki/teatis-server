export interface LastOrderNumberAndProducts {
  orderNumber: string;
  products: LastOrderProducts[];
}

export interface LastOrderProducts {
  id: string;
  sku: string;
  name: string;
  images: string[];
  productId?: number;
}
