import { Inject, Injectable } from '@nestjs/common';

import { CustomerGeneralRepoInterface } from '@Repositories/teatisDB/customerRepo/customerGeneral.repository';
import { CustomerBoxRepoInterface } from '@Repositories/teatisDB/customerRepo/customerBox.repository';
import { Status } from '@Domains/Status';
import { UpdateCustomerBoxDto } from '@Controllers/discoveries/dtos/updateCustomerBox';

export interface UpdateCustomerBoxUsecaseInterface {
  updateCustomerBox({
    products,
    email,
    uuid,
  }: UpdateCustomerBoxDto): Promise<[Status, Error]>;
}

@Injectable()
export class UpdateCustomerBoxUsecase
  implements UpdateCustomerBoxUsecaseInterface
{
  constructor(
    @Inject('CustomerGeneralRepoInterface')
    private customerGeneralRepo: CustomerGeneralRepoInterface,
    @Inject('CustomerBoxRepoInterface')
    private customerBoxRepo: CustomerBoxRepoInterface,
  ) {}

  async updateCustomerBox({
    products,
    email,
    uuid,
  }: UpdateCustomerBoxDto): Promise<[Status, Error]> {
    const [customer, getCustomerError] = uuid
      ? await this.customerGeneralRepo.getCustomerByUuid({ uuid })
      : await this.customerGeneralRepo.getCustomer({ email });
    if (getCustomerError) {
      return [null, getCustomerError];
    }

    const [_product, deleteCustomerBoxProductError] =
      await this.customerBoxRepo.deleteCustomerBoxProduct({
        customerId: customer.id,
      });

    if (deleteCustomerBoxProductError) {
      return [null, deleteCustomerBoxProductError];
    }

    const [product, postCustomerBoxProductError] =
      await this.customerBoxRepo.postCustomerBoxProduct({
        customerId: customer.id,
        products,
      });

    if (postCustomerBoxProductError) {
      return [null, postCustomerBoxProductError];
    }

    return [
      {
        status: 'Success',
      },
      null,
    ];
  }
}
