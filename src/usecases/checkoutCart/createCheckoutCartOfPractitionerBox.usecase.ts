import { Inject, Injectable } from '@nestjs/common';

import { ShopifyRepositoryInterface } from '@Repositories/shopify/shopify.repository';
import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { CustomerCheckoutCart } from '@Domains/CustomerCheckoutCart';
import { ReturnValueType } from '@Filters/customError';

import { PractitionerBoxDto } from '../../controllers/discoveries/dtos/createCheckoutCartOfCustomerBoxDto';
import { DISCOUNT_CODES } from '../utils/discountCode';
import { PRACTITIONER_BOX_PLANS } from '../utils/practitionerBoxPlan';

export interface CreateCheckoutCartOfPractitionerBoxUsecaseInterface {
  createCheckoutCartOfPractitionerBox({
    // boxType,
    // deliveryInterval,
    uuid,
    practitionerBoxUuid,
  }: PractitionerBoxDto): Promise<
     ReturnValueType<CustomerCheckoutCart>
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
    practitionerBoxUuid,
  }: PractitionerBoxDto): Promise<
     ReturnValueType<CustomerCheckoutCart>
  > {
    const attributes: { key: string, value: string }[] = [{ key: 'practitionerBoxUuid', value: practitionerBoxUuid }, { key: 'uuid', value: uuid }];

    const [customer, getCustomerError] =
      await this.customerGeneralRepository.getCustomerByUuid({ uuid });

    if (getCustomerError) {
      return [null, getCustomerError];
    }
    const [cart, createCheckoutCartOfPractitionerBoxError] =
      await this.ShopifyRepository.createCart({
        discountCode: DISCOUNT_CODES.practitionerBox.firstPurchase,
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
