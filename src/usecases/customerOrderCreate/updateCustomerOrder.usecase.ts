import { Inject, Injectable } from '@nestjs/common';

import { ShipheroRepoInterface } from 'src/repositories/shiphero/shiphero.repository';
import { ProductGeneralRepoInterface } from 'src/repositories/teatisDB/productRepo/productGeneral.repository';
import { CustomerPostPurchaseSurveyRepoInterface } from 'src/repositories/teatisDB/customerRepo/customerPostPurchaseSurvey.repository';
import { PostPurchaseSurvey } from 'src/domains/PostPurchaseSurvey';
import { CustomerGeneralRepoInterface } from 'src/repositories/teatisDB/customerRepo/customerGeneral.repository';
import { CustomerBoxRepoInterface } from 'src/repositories/teatisDB/customerRepo/customerBox.repository';
import { CustomerBox } from 'src/domains/CustomerBox';
import { UpdateCustomerOrderDto } from 'src/controllers/discoveries/dtos/updateCustomerOrder';
import { OrderQueueRepoInterface } from 'src/repositories/teatisDB/orderRepo/orderQueue.repository';
import { Product } from 'src/domains/Product';

export interface UpdateCustomerOrderUsecaseInterface {
  UpdateCustomerOrder({
    name,
    customer,
  }: UpdateCustomerOrderDto): Promise<[CustomerBox, Error]>;
}

@Injectable()
export class UpdateCustomerOrderUsecase
  implements UpdateCustomerOrderUsecaseInterface
{
  constructor(
    @Inject('ShipheroRepoInterface')
    private shipheroRepo: ShipheroRepoInterface,
    @Inject('CustomerGeneralRepoInterface')
    private customerGeneralRepo: CustomerGeneralRepoInterface,
    @Inject('ProductGeneralRepoInterface')
    private productGeneralRepo: ProductGeneralRepoInterface,
    @Inject('CustomerPostPurchaseSurveyRepoInterface')
    private customerPostPurchaseSurveyRepo: CustomerPostPurchaseSurveyRepoInterface,
    @Inject('CustomerBoxRepoInterface')
    private customerBoxRepo: CustomerBoxRepoInterface,
    @Inject('OrderQueueRepoInterface')
    private orderQueueRepo: OrderQueueRepoInterface,
  ) {}

  async UpdateCustomerOrder({
    name,
    customer,
  }: UpdateCustomerOrderDto): Promise<[CustomerBox, Error]> {
    name = '#4032';
    customer.email = 'shoki0116.highjump@gmail.com';

    const [orderQueue, orderQueueError] =
      await this.orderQueueRepo.pushOrderQueue({
        email: customer.email,
        orderNumber: name,
      });
    if (orderQueue) {
      return [null, orderQueueError];
    }

    setTimeout(async () => {
      // Case 1: if the first order
      // Case 2: if the second order but no post-purchase survey (no customer box products)
      let orderProducts: Pick<Product, 'sku'>[] = [];
      switch (customer.orders_count) {
        case 0:
          orderProducts.push({ sku: 'testbrochure' });
          break;
        case 1:
      }

      const [boxProducts, boxProductsError] =
        await this.customerBoxRepo.getCustomerBoxProducts({
          email: customer.email,
        });
      console.log('products', boxProducts);
      const [order, orderError] = await this.shipheroRepo.getOrderByOrderNumber(
        { orderNumber: name },
      );

      switch (customer.orders_count) {
        case 0:
          boxProducts.products.push({ sku: 'testbrochure' });
          break;
        case 1:
          boxProducts.products.push({ sku: 'testsocks' });
          break;
        default:
          break;
      }

      const [orderCompletion, orderCompletionError] =
        await this.shipheroRepo.updateOrder({
          orderId: order.orderId,
          products: boxProducts.products,
          orderCount: customer.orders_count,
        });
      console.log('orderCompletion', orderCompletion);
    }, 2000);

    return [{ status: 'Success' }, null];
  }
}
