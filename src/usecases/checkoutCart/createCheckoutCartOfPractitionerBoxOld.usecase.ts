import { Inject, Injectable } from '@nestjs/common';

import { CreateCheckoutCartOfPractitionerBoxOldDto } from '@Controllers/discoveries/dtos/createCheckoutCartOfPractitionerBoxOldDto';
import { ShopifyRepositoryInterface } from '@Repositories/shopify/shopify.repository';
import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { ReturnValueType } from '../../filter/customError';
import { CustomerCheckoutCart } from '../../domains/CustomerCheckoutCart';

export interface CreateCheckoutCartOfPractitionerBoxOldUsecaseInterface {
  createCheckoutCartOfPractitionerBoxOld({
    merchandiseId,
    sellingPlanId,
    uuid,
    practitionerBoxUuid,
  }: CreateCheckoutCartOfPractitionerBoxOldDto): Promise<
    ReturnValueType<CustomerCheckoutCart>
  >;
}

@Injectable()
export class CreateCheckoutCartOfPractitionerBoxOldUsecase
  implements CreateCheckoutCartOfPractitionerBoxOldUsecaseInterface
{
  constructor(
    @Inject('ShopifyRepositoryInterface')
    private ShopifyRepository: ShopifyRepositoryInterface,
    @Inject('CustomerGeneralRepositoryInterface')
    private customerGeneralRepository: CustomerGeneralRepositoryInterface,
  ) {}

  async createCheckoutCartOfPractitionerBoxOld({
    merchandiseId,
    sellingPlanId,
    uuid,
    practitionerBoxUuid,
  }: CreateCheckoutCartOfPractitionerBoxOldDto):  Promise<
    ReturnValueType<CustomerCheckoutCart>
  > {
    const attributes: { key: string; value: string }[] = [
      { key: 'practitionerBoxUuid', value: practitionerBoxUuid },
    ];

    const [customer, getCustomerError] =
    await this.customerGeneralRepository.getCustomerByUuid({
      uuid,
    });

  if (getCustomerError) {
    return [null, getCustomerError];
  }

    const [cart, createCheckoutCartOfPractitionerBoxOldError] =
      await this.ShopifyRepository.createCart({
        merchandiseId,
        sellingPlanId,
        attributes,
      });
    if (createCheckoutCartOfPractitionerBoxOldError) {
      return [null, createCheckoutCartOfPractitionerBoxOldError];
    }

    return [{ checkoutUrl: cart.checkoutUrl, email:customer.email }, null];
  }
}
