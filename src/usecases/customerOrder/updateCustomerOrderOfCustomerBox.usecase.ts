import { Inject, Injectable } from '@nestjs/common';

import { ShipheroRepositoryInterface } from '@Repositories/shiphero/shiphero.repository';
import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { CustomerBoxRepositoryInterface } from '@Repositories/teatisDB/customer/customerBox.repository';

import { UpdateCustomerOrderDto } from '@Controllers/discoveries/dtos/updateCustomerOrder';
import { OrderQueueRepositoryInterface } from '@Repositories/teatisDB/order/orderQueue.repository';
import { Product } from '@Domains/Product';
import { ShopifyRepositoryInterface } from '@Repositories/shopify/shopify.repository';
import { GetSuggestionInterface } from '@Usecases/utils/getSuggestion';
import { OrderQueue } from '@Domains/OrderQueue';

interface UpdateCustomerOrderOfCustomerBoxArgs
  extends Pick<UpdateCustomerOrderDto, 'name' | 'customer' | 'line_items'> {
  uuid: string;
}

export interface UpdateCustomerOrderOfCustomerBoxUsecaseInterface {
  updateCustomerOrderOfCustomerBox({
    name,
    customer,
    line_items,
    uuid,
  }: UpdateCustomerOrderOfCustomerBoxArgs): Promise<[OrderQueue, Error]>;
}

@Injectable()
export class UpdateCustomerOrderOfCustomerBoxUsecase
  implements UpdateCustomerOrderOfCustomerBoxUsecaseInterface
{
  constructor(
    @Inject('ShipheroRepositoryInterface')
    private shipheroRepository: ShipheroRepositoryInterface,
    @Inject('CustomerBoxRepositoryInterface')
    private customerBoxRepository: CustomerBoxRepositoryInterface,
    @Inject('OrderQueueRepositoryInterface')
    private orderQueueRepository: OrderQueueRepositoryInterface,
    @Inject('CustomerGeneralRepositoryInterface')
    private customerGeneralRepository: CustomerGeneralRepositoryInterface,
    @Inject('ShopifyRepositoryInterface')
    private readonly shopifyRepository: ShopifyRepositoryInterface,
    @Inject('GetSuggestionInterface')
    private getSuggestionUtil: GetSuggestionInterface,
  ) {}

  async updateCustomerOrderOfCustomerBox({
    name,
    customer: shopifyCustomer,
    line_items,
    uuid,
  }: UpdateCustomerOrderOfCustomerBoxArgs): Promise<[OrderQueue, Error]> {
    let [customer, getCustomerError] =
      await this.customerGeneralRepository.getCustomer({
        email: shopifyCustomer.email,
      });

    if (!customer.id) {
      [customer, getCustomerError] =
        await this.customerGeneralRepository.updateCustomerEmailByUuid({
          uuid,
          newEmail: shopifyCustomer.email,
        });

      if (getCustomerError) {
        return [null, getCustomerError];
      }
    }

    let [orderQueue, orderQueueError] =
      await this.orderQueueRepository.updateOrderQueue({
        customerId: customer?.id,
        orderNumber: name,
        status: 'scheduled',
      });
    if (orderQueueError) {
      return [null, orderQueueError];
    }

    let orderProducts: Pick<Product, 'sku'>[] = [];
    const purchasedProducts = line_items.map((lineItem) => {
      return lineItem.product_id;
    });

    const [order, orderError] =
      await this.shipheroRepository.getCustomerOrderByOrderNumber({
        orderNumber: name,
      });
    if (orderError) {
      return [null, orderError];
    }
    const HCBox: number = 6618823458871;
    const HCLSBox: number = 6618823753783;
    if (order.products.length > 1) {
      if (
        purchasedProducts.includes(HCBox) ||
        purchasedProducts.includes(HCLSBox)
      ) {
        return [
          {
            customerId: orderQueue.customerId,
            orderNumber: orderQueue.orderNumber,
            status: orderQueue.status,
            orderDate: orderQueue.orderDate,
          },
          null,
        ];
      }
    }
    const [customerOrderCount, getOrderCountError] =
      await this.shopifyRepository.getOrderCount({
        shopifyCustomerId: shopifyCustomer.id,
      });
    if (getOrderCountError) {
      return [null, getOrderCountError];
    }
    const [products, getCustomerBoxProductsError] =
      await this.customerBoxRepository.getCustomerBoxProducts({
        email: customer.email,
      });
    if (getCustomerBoxProductsError) {
      return [null, getCustomerBoxProductsError];
    }

    if (!products.length) {
      // analyze
      const [nextBoxProductsRes, nextBoxProductsError] =
        await this.getSuggestionUtil.getSuggestion({
          customer,
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
    if(customerOrderCount.orderCount <= 1){
      orderProducts.push(
        { sku: 'NP-brochure-2022q1' }, //  Uprinting brochure and
        { sku: 'x10278-SHK-SN20156' }, // Teatis Cacao powder
      )
    }
      
    const [customerOrder, updateOrderError] =
      await this.shipheroRepository.updateCustomerOrder({
        orderId: order.orderId,
        products: orderProducts,
        orderNumber: name,
      });
    if (updateOrderError) {
      return [null, updateOrderError];
    }

    [orderQueue, orderQueueError] =
      await this.orderQueueRepository.updateOrderQueue({
        customerId: customer?.id,
        orderNumber: name,
        status: 'ordered',
      });
    if (orderQueueError) {
      return [null, orderQueueError];
    }

    return [
      {
        customerId: orderQueue.customerId,
        orderNumber: orderQueue.orderNumber,
        status: orderQueue.status,
        orderDate: orderQueue.orderDate,
      },
      null,
    ];
  }
}
