import { Inject, Injectable } from '@nestjs/common';

import { ShopifyRepositoryInterface } from '@Repositories/shopify/shopify.repository';
import { PractitionerBoxDto } from '../../controllers/discoveries/dtos/createCheckoutCartOfCustomerBoxDto';
import { CustomerGeneralRepositoryInterface } from '../../repositories/teatisDB/customer/customerGeneral.repository';
import { DISCOUNT_CODES } from '../utils/discountCode';
import { PRACTITIONER_BOX_PLANS } from '../utils/practitionerBoxPlan';

interface CreateCheckoutCartOfPractitionerBoxUsecaseRes {
  checkoutUrl: string;
  email: string;
}
export interface CreateCheckoutCartOfPractitionerBoxUsecaseInterface {
  createCheckoutCartOfPractitionerBox({
    // boxType,
    // deliveryInterval,
    uuid,
    practitionerBoxUuid,
  }: PractitionerBoxDto): Promise<
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
    @Inject('CustomerGeneralRepositoryInterface')
    private customerGeneralRepository: CustomerGeneralRepositoryInterface,
  ) {}

  async createCheckoutCartOfPractitionerBox({
//   boxType,
//   deliveryInterval,
  uuid,
  practitionerBoxUuid
  }: PractitionerBoxDto): Promise<
    [CreateCheckoutCartOfPractitionerBoxUsecaseRes, Error]
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
    const [cart, createCheckoutCartOfPractitionerBoxError] =
      await this.ShopifyRepository.createCart({
        discountCode:DISCOUNT_CODES.firstPurchase,
        merchandiseId: PRACTITIONER_BOX_PLANS.merchandiseId,
        sellingPlanId: PRACTITIONER_BOX_PLANS.sellingPlanId,
        attributes,
      });
    if (createCheckoutCartOfPractitionerBoxError) {
      return [null, createCheckoutCartOfPractitionerBoxError];
    }

    return [{ checkoutUrl: cart.checkoutUrl, email: customer.email }, null];
  }
}
