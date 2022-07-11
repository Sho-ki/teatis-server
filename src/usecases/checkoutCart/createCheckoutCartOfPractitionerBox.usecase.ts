import { Inject, Injectable } from '@nestjs/common';

import { CreateCheckoutCartOfPractitionerBoxDto } from '@Controllers/discoveries/dtos/createCheckoutCartOfPractitionerBoxDto';
import { ShopifyRepositoryInterface } from '@Repositories/shopify/shopify.repository';

interface CreateCheckoutCartOfPractitionerBoxUsecaseRes {
  checkoutUrl: string;
  email?: string;
}
export interface CreateCheckoutCartOfPractitionerBoxUsecaseInterface {
  createCheckoutCartOfPractitionerBox({
    merchandiseId,
    sellingPlanId,
    practitionerBoxUuid,
  }: CreateCheckoutCartOfPractitionerBoxDto): Promise<
    [CreateCheckoutCartOfPractitionerBoxUsecaseRes, Error]
  >;
}

@Injectable()
export class CreateCheckoutCartOfPractitionerBoxUsecase
  implements CreateCheckoutCartOfPractitionerBoxUsecaseInterface
{
  constructor(
    @Inject('ShopifyRepositoryInterface')
    private ShopifyRepository: ShopifyRepositoryInterface,
  ) {}

  async createCheckoutCartOfPractitionerBox({
    merchandiseId,
    sellingPlanId,
    practitionerBoxUuid,
  }: CreateCheckoutCartOfPractitionerBoxDto): Promise<
    [CreateCheckoutCartOfPractitionerBoxUsecaseRes, Error]
  > {
    const attributes: { key: string; value: string }[] = [
      { key: 'practitionerBoxUuid', value: practitionerBoxUuid },
    ];

    const [cart, createCheckoutCartOfPractitionerBoxError] =
      await this.ShopifyRepository.createCart({
        merchandiseId,
        sellingPlanId,
        attributes,
      });
    if (createCheckoutCartOfPractitionerBoxError) {
      return [null, createCheckoutCartOfPractitionerBoxError];
    }

    return [{ checkoutUrl: cart.checkoutUrl }, null];
  }
}
