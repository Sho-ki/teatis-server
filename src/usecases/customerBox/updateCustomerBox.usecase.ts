import { Inject, Injectable } from '@nestjs/common';

import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { CustomerBoxRepositoryInterface } from '@Repositories/teatisDB/customer/customerBox.repository';
import { Status } from '@Domains/Status';
import { UpdateCustomerBoxDto } from '@Controllers/discoveries/dtos/updateCustomerBox';
import { ReturnValueType } from '../../filter/customerError';

export interface UpdateCustomerBoxUsecaseInterface {
  updateCustomerBox({
    products,
    email,
    uuid,
  }: UpdateCustomerBoxDto): Promise<ReturnValueType< Status>>;
}

@Injectable()
export class UpdateCustomerBoxUsecase
implements UpdateCustomerBoxUsecaseInterface
{
  constructor(
    @Inject('CustomerGeneralRepositoryInterface')
    private customerGeneralRepository: CustomerGeneralRepositoryInterface,
    @Inject('CustomerBoxRepositoryInterface')
    private customerBoxRepository: CustomerBoxRepositoryInterface,
  ) {}

  async updateCustomerBox({
    products,
    email,
    uuid,
  }: UpdateCustomerBoxDto): Promise<ReturnValueType<Status>>{
    const [customer, getCustomerError] = uuid
      ? await this.customerGeneralRepository.getCustomerByUuid({ uuid })
      : await this.customerGeneralRepository.getCustomer({ email });
    if (getCustomerError) {
      return [undefined, getCustomerError];
    }

    const [, deleteCustomerBoxProductError] =
      await this.customerBoxRepository.deleteCustomerBoxProduct({ customerId: customer.id });
    if (deleteCustomerBoxProductError) {
      return [undefined, deleteCustomerBoxProductError];
    }

    const [, postCustomerBoxProductError] =
      await this.customerBoxRepository.postCustomerBoxProduct({
        customerId: customer.id,
        products,
      });

    if (postCustomerBoxProductError) {
      return [undefined, postCustomerBoxProductError];
    }

    return [{ success: true }, undefined];
  }
}
