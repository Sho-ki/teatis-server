import { Inject, Injectable } from '@nestjs/common';

import { CustomerBoxRepoInterface } from 'src/repositories/teatisDB/customerRepo/customerBox.repository';
import { Status } from 'src/domains/Status';
import { OrderQueueRepoInterface } from '@Repositories/teatisDB/orderRepo/orderQueue.repository';
import { CustomerGeneralRepoInterface } from '@Repositories/teatisDB/customerRepo/customerGeneral.repository';
import { DeleteCustomerBoxDto } from '@Controllers/discoveries/dtos/deleteCustomerBox';

export interface DeleteCustomerBoxUsecaseInterface {
  deleteCustomerBox({
    email,
    name,
  }: DeleteCustomerBoxDto): Promise<[Status, Error]>;
}

@Injectable()
export class DeleteCustomerBoxUsecase
  implements DeleteCustomerBoxUsecaseInterface
{
  constructor(
    @Inject('CustomerBoxRepoInterface')
    private customerBoxRepo: CustomerBoxRepoInterface,
    @Inject('OrderQueueRepoInterface')
    private orderQueueRepo: OrderQueueRepoInterface,
    @Inject('CustomerGeneralRepoInterface')
    private customerGeneralRepo: CustomerGeneralRepoInterface,
  ) {}

  // need to delete CustomerBox every time products are shipped, since customers may not answer the next post-purchase-survey
  // which causes sending the same products as the previous order
  async deleteCustomerBox({
    email,
    name,
  }: DeleteCustomerBoxDto): Promise<[Status, Error]> {
    const [customer, getCustomerError] =
      await this.customerGeneralRepo.getCustomer({ email });
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

    const [shipOrderQueue, shipOrderQueueError] =
      await this.orderQueueRepo.updateOrderQueue({
        customerId: customer.id,
        orderNumber: name,
        status: 'fulfilled',
      });
    if (shipOrderQueueError) {
      return [null, shipOrderQueueError];
    }

    return [{ status: 'Success' }, null];
  }
}
