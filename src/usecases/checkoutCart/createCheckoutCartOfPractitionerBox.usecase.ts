import { Inject, Injectable } from '@nestjs/common';

import { ShopifyRepositoryInterface } from '@Repositories/shopify/shopify.repository';
import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { CustomerCheckoutCart } from '@Domains/CustomerCheckoutCart';
import { ReturnValueType } from '@Filters/customError';

import { PractitionerBoxDto } from '@Controllers/discoveries/dtos/createCheckoutCartOfCustomerBoxDto';
import { DISCOUNT_CODES } from '../utils/discountCode';
import { PRACTITIONER_BOX_PLANS } from '../utils/practitionerBoxPlan';
import { TEST_PRACTITIONER_BOX_UUIDS } from '../utils/testPractitionerBoxUuids';
import { CustomerSessionRepositoryInterface } from '@Repositories/teatisDB/customer/customerSession.repository';

export interface PractitionerBoxArgs extends PractitionerBoxDto {
  sessionId:string;
}
export interface CreateCheckoutCartOfPractitionerBoxUsecaseInterface {
  createCheckoutCartOfPractitionerBox({
    uuid,
    practitionerBoxUuid,
    sessionId,
  }: PractitionerBoxArgs): Promise<
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
    @Inject('CustomerSessionRepositoryInterface')
    private readonly customerSessionRepository: CustomerSessionRepositoryInterface,
  ) {}

  async createCheckoutCartOfPractitionerBox({
    uuid,
    practitionerBoxUuid,
    sessionId,
  }: PractitionerBoxArgs): Promise<
     ReturnValueType<CustomerCheckoutCart>
  > {
    const attributes: { key: string, value: string }[] = [{ key: 'practitionerBoxUuid', value: practitionerBoxUuid }, { key: 'uuid', value: uuid }];

    const [customer, getCustomerError] =
      await this.customerGeneralRepository.getCustomerByUuid({ uuid });

    if (getCustomerError) {
      return [undefined, getCustomerError];
    }
    const [cart, createCheckoutCartOfPractitionerBoxError] =
      await this.ShopifyRepository.createCart({
        discountCode: TEST_PRACTITIONER_BOX_UUIDS.includes(practitionerBoxUuid) && new Date() >= new Date('2022-10-01')?
          DISCOUNT_CODES.testPractitionerBox.firstPurchase: DISCOUNT_CODES.practitionerBox.firstPurchase,
        merchandiseId: TEST_PRACTITIONER_BOX_UUIDS.includes(practitionerBoxUuid)&& new Date() >= new Date('2022-10-01')?
          PRACTITIONER_BOX_PLANS.customized.merchandiseId: PRACTITIONER_BOX_PLANS.original.merchandiseId,
        sellingPlanId: TEST_PRACTITIONER_BOX_UUIDS.includes(practitionerBoxUuid)&& new Date() >= new Date('2022-10-01')?
          PRACTITIONER_BOX_PLANS.customized.sellingPlanId:PRACTITIONER_BOX_PLANS.original.sellingPlanId,
        attributes,
      });
    if (createCheckoutCartOfPractitionerBoxError) {
      return [undefined, createCheckoutCartOfPractitionerBoxError];
    }

    const [, upsertCustomerSessionError] =
    await this.customerSessionRepository.upsetCustomerSession({ customerId: customer.id, sessionId });

    if(upsertCustomerSessionError){
      return [undefined, upsertCustomerSessionError];
    }
    return [{ checkoutUrl: cart.checkoutUrl, email: customer.email }, undefined];
  }
}
