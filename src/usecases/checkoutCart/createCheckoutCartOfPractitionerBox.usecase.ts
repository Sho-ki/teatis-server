import { Inject, Injectable } from '@nestjs/common';

import { ShopifyRepositoryInterface } from '@Repositories/shopify/shopify.repository';
import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { CustomerCheckoutCart } from '@Domains/CustomerCheckoutCart';
import { ReturnValueType } from '@Filters/customError';

import { PractitionerBoxDto } from '@Controllers/discoveries/dtos/createCheckoutCartOfCustomerBoxDto';
import { DISCOUNT_CODES } from '../utils/discountCode';
import { PRACTITIONER_BOX_PLANS } from '../utils/practitionerBoxPlan';
import { VALID_PRACTITIONER_BOX_UUIDS } from '../utils/testPractitionerBoxUuids';
import { CustomerSessionRepositoryInterface } from '@Repositories/teatisDB/customer/customerSession.repository';

export interface PractitionerBoxArgs extends PractitionerBoxDto {
  sessionId:string;
}
export interface CreateCheckoutCartOfPractitionerBoxUsecaseInterface {
  createCheckoutCartOfPractitionerBox({
    uuid,
    practitionerBoxUuid,
    discountCode,
    sessionId,
    isOneTimePurchase,
    isWeightManagement,
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
    discountCode,
    sessionId,
    isOneTimePurchase,
    deliveryInterval,
    isWeightManagement,
  }: PractitionerBoxArgs): Promise<
     ReturnValueType<CustomerCheckoutCart>
  > {

    const attributes: { key: string, value: string }[] = [{ key: 'practitionerBoxUuid', value: practitionerBoxUuid }, { key: 'uuid', value: uuid }];
    const [customer, getCustomerError] =
      await this.customerGeneralRepository.getCustomerByUuid({ uuid });

    if (getCustomerError) {
      return [undefined, getCustomerError];
    }
    const isTrial = VALID_PRACTITIONER_BOX_UUIDS.includes(practitionerBoxUuid);
    const discountCode_ = discountCode || (isTrial
      ? DISCOUNT_CODES.testPractitionerBox.firstPurchase
      : DISCOUNT_CODES.practitionerBox.firstPurchase);

    const deliveryIntervalMap = {
      1: PRACTITIONER_BOX_PLANS.customized7,
      12: PRACTITIONER_BOX_PLANS.customized7Annual,
    };
    const deliveryIntervalPlan = deliveryIntervalMap[deliveryInterval] || PRACTITIONER_BOX_PLANS.customized7;
    const merchandiseId = isOneTimePurchase
      ? PRACTITIONER_BOX_PLANS.oneTimePurchase.merchandiseId
      : isTrial
        ? deliveryIntervalPlan.merchandiseId
        : PRACTITIONER_BOX_PLANS.original.merchandiseId;
    const sellingPlanId = isTrial
      ? deliveryIntervalPlan.sellingPlanId
      : PRACTITIONER_BOX_PLANS.original.sellingPlanId;
    const weightManagementCreateCartArgs = {
      merchandiseId: PRACTITIONER_BOX_PLANS.weightManagement.merchandiseId,
      sellingPlanId: PRACTITIONER_BOX_PLANS.weightManagement.sellingPlanId,
      discountCode: discountCode_,
      attributes,
    };
    const createCartArgs = {
      merchandiseId,
      attributes,
    };

    const [cart, createCheckoutCartOfPractitionerBoxError] =
      await this.ShopifyRepository.createCart(
        isOneTimePurchase
          ? createCartArgs
          : isWeightManagement
            ? weightManagementCreateCartArgs
            : { ...createCartArgs, discountCode: discountCode_, sellingPlanId }
      );
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
