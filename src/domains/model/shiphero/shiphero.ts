export interface ShipheroLastOrderNumberProducts {
  orderNumber: string;
  products: ShipHeroProduct[];
}

export interface ShipHeroProduct {
  shipHeroProductId: string;
  sku: string;
  name: string;
  images: ShipHeroImage[];
  dbProductId?: number;
}

interface ShipHeroImage {
  __typename?: 'ProductImage';
  src?: string;
  position?: number;
}
