export class GetRecommendProductsUsecaseArgs {
  typeformId: string;
}

export class GetRecommendProductsUsecaseRes {
  recommendProductData: {
    id: number;
    title: string;
    vendor: string;
    images?: GetRecommendProductsUsecaseImage[] | null;
    sku: string;
    provider: string;
  };
}

class GetRecommendProductsUsecaseImage {
  position: number;
  alt: string | null;
  src: string;
}
