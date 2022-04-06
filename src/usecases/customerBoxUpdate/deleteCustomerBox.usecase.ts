import { Inject, Injectable } from '@nestjs/common';

import { CustomerBoxRepoInterface } from 'src/repositories/teatisDB/customerRepo/customerBox.repository';
import { CustomerBox } from 'src/domains/CustomerBox';
import { DeleteCustomerBoxDto } from '../../controllers/discoveries/dtos/deleteCustomerBox';
import { OrderQueueRepoInterface } from '../../repositories/teatisDB/orderRepo/orderQueue.repository';
import { CustomerGeneralRepoInterface } from '../../repositories/teatisDB/customerRepo/customerGeneral.repository';

export interface DeleteCustomerBoxUsecaseInterface {
  deleteCustomerBox({
    email,
    name,
  }: DeleteCustomerBoxDto): Promise<[CustomerBox, Error]>;
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
  }: DeleteCustomerBoxDto): Promise<[CustomerBox, Error]> {
    const [getCustomerRes, getCustomerError] =
      await this.customerGeneralRepo.getCustomer({ email });
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

    const [shipOrderQueue, shipOrderQueueError] =
      await this.orderQueueRepo.updateOrderQueue({
        customerId: getCustomerRes.id,
        orderNumber: name,
        status: 'fulfilled',
      });
    if (shipOrderQueueError) {
      return [null, shipOrderQueueError];
    }

    return [{ status: 'Success' }, null];
  }
}
