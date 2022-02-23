export interface Product {
  shopifyId?: number;
  shipheroId?: string;
  dbProductId?: number;
  title: string;
  sku: string;
  vendor: string;
  images: ProductImage[];
}

export interface ProductImage {
  position: number;
  alt: string | null;
  src: string;
}

// export interface ShipHeroProduct {
//   shipHeroProductId: string;
//   sku: string;
//   name: string;
//   images: ShipHeroImage[];
//   dbProductId?: number;
// }

// interface ShipHeroImage {
//   __typename?: 'ProductImage';
//   src?: string;
//   position?: number;
// }
