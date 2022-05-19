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
    const [Customer, getCustomerError] = uuid
      ? await this.customerGeneralRepo.getCustomerByUuid({ uuid })
      : await this.customerGeneralRepo.getCustomer({ email });
    if (getCustomerError) {
      return [null, getCustomerError];
    }

    const [deleteCustomerBoxRes, deleteCustomerBoxError] =
      await this.customerBoxRepo.deleteCustomerBox({
        customerId: Customer.id,
      });

    if (deleteCustomerBoxError) {
      return [null, deleteCustomerBoxError];
    }

    const [postCustomerBoxRes, postCustomerBoxError] =
      await this.customerBoxRepo.postCustomerBox({
        customerId: Customer.id,
        products,
      });

    if (postCustomerBoxError) {
      return [null, postCustomerBoxError];
    }

    return [
      {
        status: 'Success',
      },
      null,
    ];
  }
}
