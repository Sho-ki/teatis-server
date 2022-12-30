import { Inject, Injectable } from '@nestjs/common';

import { ReturnValueType } from '@Filters/customError';
import { CancelSubscriptionDto } from '../../controllers/recharge/dto/cancelSubscription.dto';
import { ShopifyRepositoryInterface } from '../../repositories/shopify/shopify.repository';
import { Customer } from '../../domains/Customer';
import { CustomerGeneralRepositoryInterface } from '../../repositories/teatisDB/customer/customerGeneral.repository';

export interface CancelSubscriptionUsecaseInterface {
  cancelSubscription({ subscription }: CancelSubscriptionDto): Promise<
    ReturnValueType<Customer>
  >;
}

@Injectable()
export class CancelSubscriptionUsecase
implements CancelSubscriptionUsecaseInterface
{
  constructor(
    @Inject('ShopifyRepositoryInterface')
    private readonly shopifyRepository: ShopifyRepositoryInterface,
    @Inject('CustomerGeneralRepositoryInterface')
    private readonly customerGeneralRepository: CustomerGeneralRepositoryInterface,

  ) {}

  async cancelSubscription({ subscription }: CancelSubscriptionDto): Promise<
    ReturnValueType<Customer>> {

    const [uuid, getCustomerUuidByEmail] =
        await this.shopifyRepository.getCustomerUuidByEmail({ email: subscription.email });

    if(getCustomerUuidByEmail){
      return [undefined, getCustomerUuidByEmail];
    }

    const customer = await this.customerGeneralRepository.deactivateCustomerSubscription(
      { uuid, type: ['boxUnsubscribed', 'coachingUnsubscribed']  });

    return [customer];
  }

}