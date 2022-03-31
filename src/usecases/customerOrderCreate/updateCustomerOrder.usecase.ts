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
import { OrderQueue } from '../../domains/OrderQueue';
import { ShopifyRepoInterface } from '../../repositories/shopify/shopify.repository';
import { GetNextBoxUsecaseInterface } from '../nextBoxSurvey/getNextBoxSurvey.usecase';

export interface UpdateCustomerOrderUsecaseInterface {
  updateCustomerOrder({
    name,
    customer,
    line_items,
  }: UpdateCustomerOrderDto): Promise<[CustomerBox, Error]>;
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
    @Inject('GetNextBoxUsecaseInterface')
    private getNextBoxSurveyUsecase: GetNextBoxUsecaseInterface,
  ) {}

  private delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  async updateCustomerOrder({
    name,
    customer,
    line_items,
  }: UpdateCustomerOrderDto): Promise<[CustomerBox, Error]> {
    const [getCustomerRes, getCustomerError] =
      await this.customerGeneralRepo.getCustomer({ email: customer.email });
    if (getCustomerError) {
      return [null, getCustomerError];
    }

    const [updateOrderQueueRes, updateOrderQueueError] =
      await this.orderQueueRepo.updateOrderQueue({
        customerId: getCustomerRes.id,
        orderNumber: name,
        status: 'scheduled',
      });
    if (updateOrderQueueError) {
      return [null, updateOrderQueueError];
    }
    await this.delay(20000);
    // Case 1: if the first order
    // Case 1-1: if healthy carb
    // Case 1-2: if low sodium
    // Case 2: if the second order but no post-purchase survey (no customer box products)
    let orderProducts: Pick<Product, 'sku'>[] = [];

    const [getOrderCountRes, getOrderCountError] =
      await this.shopifyRepo.getOrderCount({
        shopifyCustomerId: customer.id,
      });

    if (getOrderCountError) {
      throw [null, getOrderCountError];
    }
    if (getOrderCountRes.orderCount <= 1) {
      const purchasedProducts = line_items.map((lineItem) => {
        return lineItem.product_id;
      });
      if (purchasedProducts.includes(6646306439223)) {
        let [kitComponents, getKitComponentsError] =
          await this.shipheroRepo.getKitComponents({
            sku: 'Teatis_Meal_Box_HC_Discovery_1st',
          });
        if (getKitComponentsError) {
          throw [null, getKitComponentsError];
        }
        orderProducts = kitComponents.products;
      }
      if (purchasedProducts.includes(6646305685559)) {
        let [kitComponents, getKitComponentsError] =
          await this.shipheroRepo.getKitComponents({
            sku: 'Teatis_Meal_Box_HCLS_Discovery_1st',
          });
        if (getKitComponentsError) {
          throw [null, getKitComponentsError];
        }
        orderProducts = kitComponents.products;
      }
    } else {
      const [getCustomerBoxProductsRes, getCustomerBoxProductsError] =
        await this.customerBoxRepo.getCustomerBoxProducts({
          email: customer.email,
        });
      if (getCustomerBoxProductsError) {
        throw [null, getCustomerBoxProductsError];
      }
      if (getCustomerBoxProductsRes.products.length <= 0) {
        // analyze
        const [nextBoxProductsRes, nextBoxProductsError] =
          await this.getNextBoxSurveyUsecase.getNextBoxSurvey({
            email: customer.email,
            productCount: 15,
          });
        orderProducts = nextBoxProductsRes.products.map((product) => {
          return { sku: product.sku };
        });
        if (nextBoxProductsError) {
          throw [null, nextBoxProductsError];
        }
      } else {
        orderProducts = getCustomerBoxProductsRes.products;
      }

      if (getOrderCountRes.orderCount === 2) {
        orderProducts.push(
          { sku: '00000000000043' },
          { sku: '00000000000012' },
        ); //  Diabetic Ankle Socks Single Pair and Uprinting designed boxes
      }
    }

    const [order, orderError] = await this.shipheroRepo.getOrderByOrderNumber({
      orderNumber: name,
    });
    if (orderError) {
      throw [null, orderError];
    }

    const [updateOrderRes, updateOrderError] =
      await this.shipheroRepo.updateOrder({
        orderId: order.orderId,
        products: orderProducts,
      });
    if (updateOrderError) {
      throw [null, updateOrderError];
    }

    const [completeOrderQueueRes, completeOrderQueueError] =
      await this.orderQueueRepo.updateOrderQueue({
        customerId: getCustomerRes.id,
        orderNumber: name,
        status: 'ordered',
      });
    if (completeOrderQueueError) {
      throw [null, completeOrderQueueError];
    }

    return [{ status: 'Success' }, null];
  }
}
