import { Inject, Injectable } from '@nestjs/common';

import { ShopifyRepositoryInterface } from '@Repositories/shopify/shopify.repository';
import { CreateCheckoutCartOfPractitionerMealBoxDto } from '@Controllers/discoveries/dtos/createCheckoutCartOfPractitionerMealBox';
import { CustomerGeneralRepositoryInterface } from '../../repositories/teatisDB/customer/customerGeneral.repository';
import { CustomerCheckoutCart } from '@Domains/CustomerCheckoutCart';

export interface CreateCheckoutCartOfPractitionerMealBoxUsecaseInterface {
  createCheckoutCartOfPractitionerMealBox({
    merchandiseId,
    sellingPlanId,
    practitionerBoxUuid,
    uuid,
  }: CreateCheckoutCartOfPractitionerMealBoxDto): Promise<
    [CustomerCheckoutCart?, Error?]
  >;
}

@Injectable()
export class CreateCheckoutCartOfPractitionerMealBoxUsecase
  implements CreateCheckoutCartOfPractitionerMealBoxUsecaseInterface
{
  constructor(
    @Inject('ShopifyRepositoryInterface')
    private ShopifyRepository: ShopifyRepositoryInterface,
    @Inject('CustomerGeneralRepositoryInterface')
    private customerGeneralRepository: CustomerGeneralRepositoryInterface,
  ) {}

  async createCheckoutCartOfPractitionerMealBox({
    merchandiseId,
    sellingPlanId,
    practitionerBoxUuid,
    uuid,
  }: CreateCheckoutCartOfPractitionerMealBoxDto): Promise<
    [CustomerCheckoutCart?, Error?]
  > {
    const attributes: { key: string; value: string }[] = [
      { key: 'practitionerBoxUuid', value: practitionerBoxUuid },
      { key: 'uuid', value: uuid },
    ];

    const [customer, getCustomerError] =
      await this.customerGeneralRepository.getCustomerByUuid({
        uuid,
      });

    if (getCustomerError) {
      return [null, getCustomerError];
    }
    const [cart, createCheckoutCartOfPractitionerMealBoxError] =
      await this.ShopifyRepository.createCart({
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
