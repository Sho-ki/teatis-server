import { Inject, Injectable } from '@nestjs/common';

import { CustomerBoxRepositoryInterface } from '@Repositories/teatisDB/customer/customerBox.repository';
import { Status } from 'src/domains/Status';
import { OrderQueueRepositoryInterface } from '@Repositories/teatisDB/order/orderQueue.repository';
import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { DeleteCustomerBoxDto } from '@Controllers/discoveries/dtos/deleteCustomerBox';

export interface DeleteCustomerBoxUsecaseInterface {
  deleteCustomerBox({
    customer,
    name,
  }: DeleteCustomerBoxDto): Promise<[Status?, Error?]>;
}

@Injectable()
export class DeleteCustomerBoxUsecase
  implements DeleteCustomerBoxUsecaseInterface
{
  constructor(
    @Inject('CustomerBoxRepositoryInterface')
    private customerBoxRepository: CustomerBoxRepositoryInterface,
    @Inject('OrderQueueRepositoryInterface')
    private orderQueueRepository: OrderQueueRepositoryInterface,
    @Inject('CustomerGeneralRepositoryInterface')
    private customerGeneralRepository: CustomerGeneralRepositoryInterface,
  ) {}

  // need to delete CustomerBox every time products are shipped, since customers may not answer the next post-purchase-survey
  // which causes sending the same products as the previous order
  async deleteCustomerBox({
    customer: shopifyCustomer,
    name,
  }: DeleteCustomerBoxDto): Promise<[Status?, Error?]> {
    const [customer, getCustomerError] =
      await this.customerGeneralRepository.getCustomer({
        email: shopifyCustomer.email,
      });
    if (getCustomerError) {
      return [null, getCustomerError];
    }

    const [_product, deleteCustomerBoxProductError] =
      await this.customerBoxRepository.deleteCustomerBoxProduct({
        customerId: customer.id,
      });
    if (deleteCustomerBoxProductError) {
      return [null, deleteCustomerBoxProductError];
    }

    const [shipOrderQueue, shipOrderQueueError] =
      await this.orderQueueRepository.updateOrderQueue({
        customerId: customer.id,
        orderNumber: name,
        status: 'fulfilled',
      });
    if (shipOrderQueueError) {
      return [null, shipOrderQueueError];
    }

    return [{ success: true }, null];
  }
}
