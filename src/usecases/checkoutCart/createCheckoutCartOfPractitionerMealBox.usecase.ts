import { Inject, Injectable } from '@nestjs/common';

import { ShopifyRepoInterface } from '@Repositories/shopify/shopify.repository';
import { CreateCheckoutCartOfPractitionerMealBoxDto } from '@Controllers/discoveries/dtos/createCheckoutCartOfPractitionerMealBox';
import { CustomerGeneralRepoInterface } from '../../repositories/teatisDB/customerRepo/customerGeneral.repository';

interface CreateCheckoutCartOfPractitionerMealBoxUsecaseRes {
  checkoutUrl: string;
  email: string;
}
export interface CreateCheckoutCartOfPractitionerMealBoxUsecaseInterface {
  createCheckoutCartOfPractitionerMealBox({
    merchandiseId,
    sellingPlanId,
    practitionerBoxUuid,
    uuid,
  }: CreateCheckoutCartOfPractitionerMealBoxDto): Promise<
    [CreateCheckoutCartOfPractitionerMealBoxUsecaseRes, Error]
  >;
}

@Injectable()
export class CreateCheckoutCartOfPractitionerMealBoxUsecase
  implements CreateCheckoutCartOfPractitionerMealBoxUsecaseInterface
{
  constructor(
    @Inject('ShopifyRepoInterface')
    private ShopifyRepo: ShopifyRepoInterface,
    @Inject('CustomerGeneralRepoInterface')
    private customerGeneralRepo: CustomerGeneralRepoInterface,
  ) {}

  async createCheckoutCartOfPractitionerMealBox({
    merchandiseId,
    sellingPlanId,
    practitionerBoxUuid,
    uuid,
  }: CreateCheckoutCartOfPractitionerMealBoxDto): Promise<
    [CreateCheckoutCartOfPractitionerMealBoxUsecaseRes, Error]
  > {
    const attributes: { key: string; value: string }[] = [
      { key: 'practitionerBoxUuid', value: practitionerBoxUuid },
      { key: 'uuid', value: uuid },
    ];

    const [customer, getCustomerError] =
      await this.customerGeneralRepo.getCustomerByUuid({
        uuid,
      });

    if (getCustomerError) {
      return [null, getCustomerError];
    }
    const [cart, createCheckoutCartOfPractitionerMealBoxError] =
      await this.ShopifyRepo.createCart({
        merchandiseId,
        sellingPlanId,
        attributes,
      });
    if (createCheckoutCartOfPractitionerMealBoxError) {
      return [null, createCheckoutCartOfPractitionerMealBoxError];
    }

    return [{ checkoutUrl: cart.checkoutUrl, email: customer.email }, null];
  }
}
