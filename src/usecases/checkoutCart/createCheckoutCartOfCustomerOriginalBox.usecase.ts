import { Inject, Injectable } from '@nestjs/common';

import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { CreateCheckoutCartOfCustomerOriginalBoxDto } from '@Controllers/discoveries/dtos/createCheckoutCartOfCustomerOriginalBoxDto';
import { ShopifyRepositoryInterface } from '@Repositories/shopify/shopify.repository';
import { Customer } from '@Domains/Customer';
import { CustomerCheckoutCart } from '@Domains/CustomerCheckoutCart';
import { ReturnValueType } from '../../filter/customError';


export interface CreateCheckoutCartOfCustomerOriginalBoxUsecaseInterface {
  createCheckoutCartOfCustomerOriginalBox({
    merchandiseId,
    sellingPlanId,
    uuid,
  }: CreateCheckoutCartOfCustomerOriginalBoxDto): Promise<
    ReturnValueType<CustomerCheckoutCart>
  >;
}

@Injectable()
export class CreateCheckoutCartOfCustomerOriginalBoxUsecase
  implements CreateCheckoutCartOfCustomerOriginalBoxUsecaseInterface
{
  constructor(
    @Inject('ShopifyRepositoryInterface')
    private ShopifyRepository: ShopifyRepositoryInterface,
    @Inject('CustomerGeneralRepositoryInterface')
    private customerGeneralRepository: CustomerGeneralRepositoryInterface,
  ) {}

  async createCheckoutCartOfCustomerOriginalBox({
    merchandiseId,
    sellingPlanId,
    uuid,
  }: CreateCheckoutCartOfCustomerOriginalBoxDto): Promise<
    ReturnValueType<CustomerCheckoutCart>
  > {
    const attributes: { key: string; value: string }[] = [
      { key: 'uuid', value: uuid },
    ];
    const [customer, getCustomerError] =
      await this.customerGeneralRepository.getCustomerByUuid({
        uuid,
      });

    if (getCustomerError) {
      return [null, getCustomerError];
    }
    const [cart, createCheckoutCartOfCustomerOriginalBoxError] =
      await this.ShopifyRepository.createCart({
        merchandiseId,
        sellingPlanId,
        attributes,
      });
    if (createCheckoutCartOfCustomerOriginalBoxError) {
      return [null, createCheckoutCartOfCustomerOriginalBoxError];
    }

    return [{ checkoutUrl: cart.checkoutUrl, email: customer.email }, null];
  }
}
