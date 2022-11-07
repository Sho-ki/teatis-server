import { Inject, Injectable } from '@nestjs/common';

import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { ShopifyRepositoryInterface } from '@Repositories/shopify/shopify.repository';
import { CustomerBoxDto } from '../../controllers/discoveries/dtos/createCheckoutCartOfCustomerBoxDto';
import { CUSTOMER_BOX_PLANS } from '../utils/customerBoxPlans';
import { DISCOUNT_CODES } from '../utils/discountCode';
import { CustomerCheckoutCart } from '../../domains/CustomerCheckoutCart';
import { ReturnValueType } from '@Filters/customError';

export interface CreateCheckoutCartOfCustomerBoxUsecaseInterface {
  createCheckoutCartOfCustomerBox({
    boxName,
    boxType,
    deliveryInterval,
    discountCode,
    uuid,
  }: CustomerBoxDto): Promise<
    ReturnValueType<CustomerCheckoutCart>
  >;
}

@Injectable()
export class CreateCheckoutCartOfCustomerBoxUsecase
implements CreateCheckoutCartOfCustomerBoxUsecaseInterface
{
  constructor(
    @Inject('ShopifyRepositoryInterface')
    private ShopifyRepository: ShopifyRepositoryInterface,
    @Inject('CustomerGeneralRepositoryInterface')
    private customerGeneralRepository: CustomerGeneralRepositoryInterface,
  ) {}

  async createCheckoutCartOfCustomerBox({
    boxName,
    deliveryInterval,
    discountCode,
    uuid,
  }: CustomerBoxDto): Promise<
    ReturnValueType<CustomerCheckoutCart>
  > {
    const attributes: { key: string, value: string }[] = [{ key: 'uuid', value: uuid }];
    const [customer, getCustomerError] =
      await this.customerGeneralRepository.getCustomerByUuid({ uuid });
    if (getCustomerError) {
      return [undefined, getCustomerError];
    }
    let merchandiseId:string,
      sellingPlanId:string = undefined;
    if(boxName==='HC'){
      switch(deliveryInterval){
        case 1:
          merchandiseId = CUSTOMER_BOX_PLANS.HC.ONE.merchandiseId;
          sellingPlanId = CUSTOMER_BOX_PLANS.HC.ONE.sellingPlanId;
          break;
        case 3:
          merchandiseId = CUSTOMER_BOX_PLANS.HC.THREE.merchandiseId;
          sellingPlanId = CUSTOMER_BOX_PLANS.HC.THREE.sellingPlanId;
          break;
        case 6:
          merchandiseId = CUSTOMER_BOX_PLANS.HC.SIX.merchandiseId;
          sellingPlanId = CUSTOMER_BOX_PLANS.HC.SIX.sellingPlanId;
          break;
        case 12:
          merchandiseId = CUSTOMER_BOX_PLANS.HC.TWELVE.merchandiseId;
          sellingPlanId = CUSTOMER_BOX_PLANS.HC.TWELVE.sellingPlanId;
          break;
        default:break;
      }
    }else if(boxName==='HCLS'){
      switch(deliveryInterval){
        case 1:
          merchandiseId = CUSTOMER_BOX_PLANS.HCLS.ONE.merchandiseId;
          sellingPlanId = CUSTOMER_BOX_PLANS.HCLS.ONE.sellingPlanId;
          break;
        case 3:
          merchandiseId = CUSTOMER_BOX_PLANS.HCLS.THREE.merchandiseId;
          sellingPlanId = CUSTOMER_BOX_PLANS.HCLS.THREE.sellingPlanId;
          break;
        case 6:
          merchandiseId = CUSTOMER_BOX_PLANS.HCLS.SIX.merchandiseId;
          sellingPlanId = CUSTOMER_BOX_PLANS.HCLS.SIX.sellingPlanId;
          break;
        case 12:
          merchandiseId = CUSTOMER_BOX_PLANS.HCLS.TWELVE.merchandiseId;
          sellingPlanId = CUSTOMER_BOX_PLANS.HCLS.TWELVE.sellingPlanId;
          break;
        default:break;
      }
    }
    const [cart, createCheckoutCartOfCustomerBoxError] =
      await this.ShopifyRepository.createCart({
        discountCode: discountCode || DISCOUNT_CODES.customerBox.firstPurchase,
        merchandiseId,
        sellingPlanId,
        attributes,
      });
    if (createCheckoutCartOfCustomerBoxError) {
      return [null, createCheckoutCartOfCustomerBoxError];
    }

    return [{ checkoutUrl: cart.checkoutUrl, email: customer.email }, undefined];
  }
}
