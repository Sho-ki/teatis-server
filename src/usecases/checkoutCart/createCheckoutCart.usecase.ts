import { Inject, Injectable } from '@nestjs/common';

import { ShopifyRepositoryInterface } from '@Repositories/shopify/shopify.repository';
import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { CustomerCheckoutCart } from '@Domains/CustomerCheckoutCart';
import { ReturnValueType } from '@Filters/customError';

import { DISCOUNT_CODES } from '../utils/discountCode';
import { CustomerSessionRepositoryInterface } from '@Repositories/teatisDB/customer/customerSession.repository';
import { BOX_PLANS, COACH_PLAN } from '../utils/boxPlans';
import { CreateCheckoutCartDto } from '../../controllers/discoveries/dtos/createCheckoutCartDto';

export interface CreateCheckoutCartArgs extends CreateCheckoutCartDto {
  sessionId:string;
}
export interface CreateCheckoutCartUsecaseInterface {
  createCheckoutCart({
    customerType,
    uuid,
    practitionerBoxUuid,
    discountCode,
    sessionId,
    isOneTimePurchase,
    deliveryInterval,
    size,
    isWeightManagement,
  }: CreateCheckoutCartArgs): Promise<
     ReturnValueType<CustomerCheckoutCart>
  >;
}

@Injectable()
export class CreateCheckoutCartUsecase
implements CreateCheckoutCartUsecaseInterface
{
  constructor(
    @Inject('ShopifyRepositoryInterface')
    private ShopifyRepository: ShopifyRepositoryInterface,
    @Inject('CustomerGeneralRepositoryInterface')
    private customerGeneralRepository: CustomerGeneralRepositoryInterface,
    @Inject('CustomerSessionRepositoryInterface')
    private readonly customerSessionRepository: CustomerSessionRepositoryInterface,
  ) {}

  async createCheckoutCart({
    customerType,
    uuid,
    practitionerBoxUuid,
    discountCode,
    sessionId,
    deliveryInterval = 1,
    size = 'mini',
    // isOneTimePurchase,
    // isWeightManagement,
  }: CreateCheckoutCartArgs): Promise<
     ReturnValueType<CustomerCheckoutCart>
  > {

    const attributes: { key: string, value: string }[] = [{ key: 'uuid', value: uuid }];
    if(practitionerBoxUuid) attributes.push({ key: 'practitionerBoxUuid', value: practitionerBoxUuid });

    const [customer, getCustomerError] =
      await this.customerGeneralRepository.getCustomerByUuid({ uuid });

    if (getCustomerError) {
      return [undefined, getCustomerError];
    }

    let merchandiseId:string;
    let sellingPlanId:string;

    if(customerType === 'driver' ){
      merchandiseId = COACH_PLAN[`EVERY${deliveryInterval}`].merchandiseId;
      sellingPlanId = COACH_PLAN[`EVERY${deliveryInterval}`].sellingPlanId;
      discountCode = discountCode || DISCOUNT_CODES.driver.firstPurchase;
    } else {
      merchandiseId = BOX_PLANS[`EVERY${deliveryInterval}`][size.toUpperCase()].COACH.merchandiseId;
      sellingPlanId = BOX_PLANS[`EVERY${deliveryInterval}`][size.toUpperCase()].COACH.sellingPlanId;
      discountCode = discountCode || DISCOUNT_CODES.customerBox.firstPurchase;

    }

    // const weightManagementCreateCartArgs = {
    //   merchandiseId: BOX_PLANS.weightManagement.merchandiseId,
    //   sellingPlanId: BOX_PLANS.weightManagement.sellingPlanId,
    //   discountCode: discountCode_,
    //   attributes,
    // };

    const [cart, createCheckoutCartError] =
      await this.ShopifyRepository.createCart(
        { discountCode, merchandiseId, sellingPlanId, attributes }
      );
    if (createCheckoutCartError) {
      return [undefined, createCheckoutCartError];
    }

    await this.customerSessionRepository.upsertCustomerSession({ customerId: customer.id, sessionId });

    return [{ checkoutUrl: cart.checkoutUrl, email: customer.email }, undefined];
  }
}
