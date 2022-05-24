import { Inject, Injectable } from '@nestjs/common';

import { ShipheroRepoInterface } from '@Repositories/shiphero/shiphero.repository';
import { CustomerGeneralRepoInterface } from '@Repositories/teatisDB/customerRepo/customerGeneral.repository';
import { CustomerBoxRepoInterface } from '@Repositories/teatisDB/customerRepo/customerBox.repository';

import { UpdateCustomerOrderDto } from '@Controllers/discoveries/dtos/updateCustomerOrder';
import { OrderQueueRepoInterface } from '@Repositories/teatisDB/orderRepo/orderQueue.repository';
import { Product } from 'src/domains/Product';
import { ShopifyRepoInterface } from '@Repositories/shopify/shopify.repository';
import { GetNextBoxInterface } from '@Usecases/utils/getNextBox';
import { Status } from '@Domains/Status';

export interface UpdateCustomerOrderUsecaseInterface {
  updateCustomerOrder({
    name,
    customer,
    line_items,
  }: UpdateCustomerOrderDto): Promise<[Status, Error]>;
}

@Injectable()
export class UpdateCustomerOrderUsecase
  implements UpdateCustomerOrderUsecaseInterface
{
  constructor(
    @Inject('ShipheroRepoInterface')
    private shipheroRepo: ShipheroRepoInterface,
    @Inject('CustomerBoxRepoInterface')
    private customerBoxRepo: CustomerBoxRepoInterface,
    @Inject('OrderQueueRepoInterface')
    private orderQueueRepo: OrderQueueRepoInterface,
    @Inject('CustomerGeneralRepoInterface')
    private customerGeneralRepo: CustomerGeneralRepoInterface,
    @Inject('ShopifyRepoInterface')
    private readonly shopifyRepo: ShopifyRepoInterface,
    @Inject('GetNextBoxInterface')
    private nextBoxUtil: GetNextBoxInterface,
  ) {}

  async updateCustomerOrder({
    name,
    customer: shopifyCustomer,
    line_items,
    note_attributes,
  }: UpdateCustomerOrderDto): Promise<[Status, Error]> {
    let [customer, getCustomerError] =
      await this.customerGeneralRepo.getCustomer({
        email: shopifyCustomer.email,
      });

    if (getCustomerError) {
      [customer, getCustomerError] =
        await this.customerGeneralRepo.updateCustomerEmailByUuid({
          uuid: note_attributes[0]?.value,
          newEmail: shopifyCustomer.email,
        });

      if (getCustomerError) {
        return [null, getCustomerError];
      }
    }
    let [orderQueue, orderQueueError] =
      await this.orderQueueRepo.updateOrderQueue({
        customerId: customer?.id,
        orderNumber: name,
        status: 'scheduled',
      });
    if (orderQueueError) {
      return [null, orderQueueError];
    }

    // await this.delay(7000);
    // Case 1: if the first order
    // Case 1-1: if healthy carb
    // Case 1-2: if low sodium
    // Case 2: if the second order but no post-purchase survey (no customer box products)
    let orderProducts: Pick<Product, 'sku'>[] = [];
    const purchasedProducts = line_items.map((lineItem) => {
      return lineItem.product_id;
    });

    const [order, orderError] =
      await this.shipheroRepo.getCustomerOrderByOrderNumber({
        orderNumber: name,
      });
    if (orderError) {
      return [null, orderError];
    }

    if (order.products.length > 1) {
      if (
        purchasedProducts.includes(6618823458871) ||
        purchasedProducts.includes(6618823753783)
      ) {
        return [{ status: 'Success' }, null];
      }
    }
    const [customerOrderCount, getOrderCountError] =
      await this.shopifyRepo.getOrderCount({
        shopifyCustomerId: shopifyCustomer.id,
      });
    if (getOrderCountError) {
      return [null, getOrderCountError];
    }
    const [products, getCustomerBoxProductsError] =
      await this.customerBoxRepo.getCustomerBoxProducts({
        email: shopifyCustomer.email,
      });
    if (getCustomerBoxProductsError) {
      return [null, getCustomerBoxProductsError];
    }

    if (!products.length) {
      // analyze
      const [nextBoxProductsRes, nextBoxProductsError] =
        await this.nextBoxUtil.getNextBoxSurvey({
          email: shopifyCustomer.email,
          productCount: 15,
        });
      orderProducts = nextBoxProductsRes.products.map((product) => {
        return { sku: product.sku };
      });
      if (nextBoxProductsError) {
        return [null, nextBoxProductsError];
      }
    } else {
      orderProducts = products;
    }
    customerOrderCount.orderCount <= 1
      ? orderProducts.push(
          { sku: 'NP-brochure-2022q1' },
          { sku: 'NP-carton-lightblue' },
        ) //  Uprinting brochure and Uprinting designed boxes
      : orderProducts.push({ sku: 'NP-carton-lightblue' }); //   Uprinting designed boxes

    const [customerOrder, updateOrderError] =
      await this.shipheroRepo.updateCustomerOrder({
        orderId: order.orderId,
        products: orderProducts,
        orderNumber: name,
      });
    if (updateOrderError) {
      return [null, updateOrderError];
    }

    [orderQueue, orderQueueError] = await this.orderQueueRepo.updateOrderQueue({
      customerId: customer?.id,
      orderNumber: name,
      status: 'ordered',
    });
    if (orderQueueError) {
      return [null, orderQueueError];
    }

    return [{ status: 'Success' }, null];
  }
}
