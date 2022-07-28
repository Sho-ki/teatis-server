import { Inject, Injectable } from '@nestjs/common';

import { CreateCheckoutCartOfPractitionerBoxDto } from '@Controllers/discoveries/dtos/createCheckoutCartOfPractitionerBoxDto';
import { ShopifyRepositoryInterface } from '@Repositories/shopify/shopify.repository';
import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { CustomerCheckoutCart } from '@Domains/CustomerCheckoutCart';


export interface CreateCheckoutCartOfPractitionerBoxUsecaseInterface {
  createCheckoutCartOfPractitionerBox({
    merchandiseId,
    sellingPlanId,
    uuid,
    practitionerBoxUuid,
  }: CreateCheckoutCartOfPractitionerBoxDto): Promise<
    [CustomerCheckoutCart?, Error?]
  >;
}

@Injectable()
export class CreateCheckoutCartOfPractitionerBoxUsecase
  implements CreateCheckoutCartOfPractitionerBoxUsecaseInterface
{
  constructor(
    @Inject('ShopifyRepositoryInterface')
    private ShopifyRepository: ShopifyRepositoryInterface,
    @Inject('CustomerGeneralRepositoryInterface')
    private customerGeneralRepository: CustomerGeneralRepositoryInterface,
  ) {}

  async createCheckoutCartOfPractitionerBox({
    merchandiseId,
    sellingPlanId,
    uuid,
    practitionerBoxUuid,
  }: CreateCheckoutCartOfPractitionerBoxDto): Promise<
    [CustomerCheckoutCart?, Error?]
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

    const [cart, createCheckoutCartOfPractitionerBoxError] =
      await this.ShopifyRepository.createCart({
        merchandiseId,
        sellingPlanId,
        attributes,
      });
    if (createCheckoutCartOfPractitionerBoxError) {
      return [null, createCheckoutCartOfPractitionerBoxError];
    }

    return [{ checkoutUrl: cart.checkoutUrl, email:customer.email }, null];
  }
}
