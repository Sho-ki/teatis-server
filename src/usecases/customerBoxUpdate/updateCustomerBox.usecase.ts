import { Inject, Injectable } from '@nestjs/common';

import { CustomerGeneralRepoInterface } from 'src/repositories/teatisDB/customerRepo/customerGeneral.repository';
import { CustomerBoxRepoInterface } from 'src/repositories/teatisDB/customerRepo/customerBox.repository';
import { CustomerBox } from 'src/domains/CustomerBox';
import { UpdateCustomerBoxDto } from '../../controllers/discoveries/dtos/updateCustomerBox';

export interface UpdateCustomerBoxUsecaseInterface {
  updateCustomerBox({
    products,
    email,
    uuid,
  }: UpdateCustomerBoxDto): Promise<[CustomerBox, Error]>;
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
  }: UpdateCustomerBoxDto): Promise<[CustomerBox, Error]> {
    const [getCustomerRes, getCustomerError] = uuid
      ? await this.customerGeneralRepo.getCustomerByUuid({ uuid })
      : await this.customerGeneralRepo.getCustomer({ email });
    if (getCustomerError) {
      return [null, getCustomerError];
    }

    const [deleteCustomerBoxRes, deleteCustomerBoxError] =
      await this.customerBoxRepo.deleteCustomerBox({
        customerId: getCustomerRes.id,
      });

    if (deleteCustomerBoxError) {
      return [null, deleteCustomerBoxError];
    }

    const [postCustomerBoxRes, postCustomerBoxError] =
      await this.customerBoxRepo.postCustomerBox({
        customerId: getCustomerRes.id,
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
