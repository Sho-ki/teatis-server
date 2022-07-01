import { Inject, Injectable } from '@nestjs/common';

import { ShipheroRepoInterface } from '@Repositories/shiphero/shiphero.repository';
import { CustomerGeneralRepoInterface } from '@Repositories/teatisDB/customerRepo/customerGeneral.repository';
import { CustomerBoxRepoInterface } from '@Repositories/teatisDB/customerRepo/customerBox.repository';

import { UpdateCustomerOrderDto } from '@Controllers/discoveries/dtos/updateCustomerOrder';
import { OrderQueueRepoInterface } from '@Repositories/teatisDB/orderRepo/orderQueue.repository';
import { Product } from '@Domains/Product';
import { ShopifyRepoInterface } from '@Repositories/shopify/shopify.repository';
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
      await this.customerGeneralRepo.getCustomer({
        email: shopifyCustomer.email,
      });

    if (!customer.id) {
      [customer, getCustomerError] =
        await this.customerGeneralRepo.updateCustomerEmailByUuid({
          uuid,
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
      await this.shopifyRepo.getOrderCount({
        shopifyCustomerId: shopifyCustomer.id,
      });
    if (getOrderCountError) {
      return [null, getOrderCountError];
    }
    const [products, getCustomerBoxProductsError] =
      await this.customerBoxRepo.getCustomerBoxProducts({
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
    customerOrderCount.orderCount <= 1
      ? orderProducts.push(
          { sku: 'NP-brochure-2022q1' }, //  Uprinting brochure and
          { sku: 'NP-packagingtape' }, // Packaging Tape
          { sku: 'x10278-SHK-SN20156' }, // Teatis Cacao powder
        )
      : orderProducts.push({ sku: 'NP-packagingtape' }); //   Packaging Tape

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