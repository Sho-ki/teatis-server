import { Inject, Injectable } from '@nestjs/common';

import { ShipheroRepoInterface } from '@Repositories/shiphero/shiphero.repository';
import { CustomerGeneralRepoInterface } from '@Repositories/teatisDB/customerRepo/customerGeneral.repository';
import { CustomerBoxRepoInterface } from '@Repositories/teatisDB/customerRepo/customerBox.repository';

import { UpdateCustomerOrderDto } from '@Controllers/discoveries/dtos/updateCustomerOrder';
import { OrderQueueRepoInterface } from '@Repositories/teatisDB/orderRepo/orderQueue.repository';
import { Product } from 'src/domains/Product';
import { ShopifyRepoInterface } from '@Repositories/shopify/shopify.repository';
import { PostPrePurchaseSurveyUsecaseInterface } from '@Usecases/prePurchaseSurvey/postPrePurchaseSurvey.usecase';
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
    @Inject('PostPrePurchaseSurveyUsecaseInterface')
    private postPrePurchaseSurveyUsecase: PostPrePurchaseSurveyUsecaseInterface,
  ) {}

  private delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  async updateCustomerOrder({
    name,
    customer,
    line_items,
    note_attributes,
  }: UpdateCustomerOrderDto): Promise<[Status, Error]> {
    const [Customer, getCustomerError] =
      await this.customerGeneralRepo.getCustomer({ email: customer.email });
    let customerId = Customer?.id;
    if (getCustomerError) {
      const [updateEmailRes, updateEmailError] =
        await this.customerGeneralRepo.updateEmailByUuid({
          uuid: note_attributes[0]?.value,
          newEmail: customer.email,
        });
      customerId = updateEmailRes.id;
      if (updateEmailError) {
        return [null, updateEmailError];
      }
    }
    const [updateOrderQueueRes, updateOrderQueueError] =
      await this.orderQueueRepo.updateOrderQueue({
        customerId,
        orderNumber: name,
        status: 'scheduled',
      });
    if (updateOrderQueueError) {
      return [null, updateOrderQueueError];
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

    const [Order, orderError] = await this.shipheroRepo.getOrderByOrderNumber({
      orderNumber: name,
    });
    if (orderError) {
      return [null, orderError];
    }

    if (Order.products.length > 1) {
      if (
        purchasedProducts.includes(6618823458871) ||
        purchasedProducts.includes(6618823753783)
      ) {
        return [{ status: 'Success' }, null];
      }
    }
    const [getOrderCountRes, getOrderCountError] =
      await this.shopifyRepo.getOrderCount({
        shopifyCustomerId: customer.id,
      });
    if (getOrderCountError) {
      return [null, getOrderCountError];
    }
    const [Products, getCustomerBoxProductsError] =
      await this.customerBoxRepo.getCustomerBoxProducts({
        email: customer.email,
      });
    if (getCustomerBoxProductsError) {
      return [null, getCustomerBoxProductsError];
    }

    if (!Products.length) {
      // analyze
      const [nextBoxProductsRes, nextBoxProductsError] =
        await this.nextBoxUtil.getNextBoxSurvey({
          email: customer.email,
          productCount: 15,
        });
      orderProducts = nextBoxProductsRes.products.map((product) => {
        return { sku: product.sku };
      });
      if (nextBoxProductsError) {
        return [null, nextBoxProductsError];
      }
    } else {
      orderProducts = Products;
    }
    getOrderCountRes.orderCount <= 1
      ? orderProducts.push(
          { sku: 'NP-brochure-2022q1' },
          { sku: 'NP-carton-lightblue' },
        ) //  Uprinting brochure and Uprinting designed boxes
      : orderProducts.push({ sku: 'NP-carton-lightblue' }); //   Uprinting designed boxes

    const [UpdatedOrder, updateOrderError] =
      await this.shipheroRepo.updateOrder({
        orderId: Order.orderId,
        products: orderProducts,
        orderNumber: name,
      });
    if (updateOrderError) {
      return [null, updateOrderError];
    }

    const [completeOrderQueueRes, completeOrderQueueError] =
      await this.orderQueueRepo.updateOrderQueue({
        customerId,
        orderNumber: name,
        status: 'ordered',
      });
    if (completeOrderQueueError) {
      return [null, completeOrderQueueError];
    }

    return [{ status: 'Success' }, null];
  }
}
