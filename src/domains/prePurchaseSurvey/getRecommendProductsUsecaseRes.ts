export interface GetRecommendProductsUsecaseArgs {
  typeformId: string;
}

export interface GetRecommendProductsUsecaseRes {
  recommendProductData: {
    id: number;
    title: string;
    vendor: string;
    images?: GetRecommendProductsUsecaseImage[] | null;
    sku: string;
    provider: string;
  };
  customerId: number;
}

interface GetRecommendProductsUsecaseImage {
  position: number;
  alt: string | null;
  src: string;
}
