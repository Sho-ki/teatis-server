import { Inject, Injectable } from '@nestjs/common';

import { ShipheroRepositoryInterface } from '@Repositories/shiphero/shiphero.repository';

import { UpdateCustomerOrderDto } from '@Controllers/discoveries/dtos/updateCustomerOrder';
import { OrderQueueRepositoryInterface } from '@Repositories/teatisDB/order/orderQueue.repository';
import { Product } from 'src/domains/Product';
import { ShopifyRepositoryInterface } from '@Repositories/shopify/shopify.repository';
import { GetSuggestionInterface } from '@Usecases/utils/getSuggestion';
import { CreateCustomerUsecaseInterface } from '@Usecases/utils/createCustomer';
import { PractitionerBoxRepositoryInterface } from '@Repositories/teatisDB/practitioner/practitionerBox.repo';
import { OrderQueue } from '@Domains/OrderQueue';
import { PractitionerBoxOrderHistoryRepositoryInterface } from '@Repositories/teatisDB/practitioner/practitionerBoxOrderHistory.repository';
import { PRODUCT_COUNT } from '../utils/productCount';

interface UpdateCustomerOrderOfPractitionerBoxArgs
  extends Pick<
    UpdateCustomerOrderDto,
    'name' | 'customer' | 'subtotal_price' | 'line_items'
  > {
  practitionerBoxUuid: string;
}

export interface UpdateCustomerOrderOfPractitionerBoxUsecaseInterface {
  updateCustomerOrderOfPractitionerBox({
    name,
    customer,
    subtotal_price,
    line_items,
    practitionerBoxUuid,
  }: UpdateCustomerOrderOfPractitionerBoxArgs): Promise<[OrderQueue, Error]>;
}

@Injectable()
export class UpdateCustomerOrderOfPractitionerBoxUsecase
  implements UpdateCustomerOrderOfPractitionerBoxUsecaseInterface
{
  constructor(
    @Inject('ShipheroRepositoryInterface')
    private shipheroRepository: ShipheroRepositoryInterface,
    @Inject('PractitionerBoxOrderHistoryRepositoryInterface')
    private practitionerBoxOrderHistoryRepository: PractitionerBoxOrderHistoryRepositoryInterface,
    @Inject('OrderQueueRepositoryInterface')
    private orderQueueRepository: OrderQueueRepositoryInterface,
    @Inject('PractitionerBoxRepositoryInterface')
    private practitionerBoxRepository: PractitionerBoxRepositoryInterface,
    @Inject('ShopifyRepositoryInterface')
    private readonly shopifyRepository: ShopifyRepositoryInterface,
    @Inject('GetSuggestionInterface')
    private getSuggestionUtil: GetSuggestionInterface,
    @Inject('CreateCustomerUsecaseInterface')
    private createCustomerUtil: CreateCustomerUsecaseInterface,
  ) {}

  async updateCustomerOrderOfPractitionerBox({
    name,
    customer: shopifyCustomer,
    subtotal_price,
    line_items,
    practitionerBoxUuid,
  }: UpdateCustomerOrderOfPractitionerBoxArgs): Promise<[OrderQueue, Error]> {
    let [customer, getCustomerError] =
      await this.createCustomerUtil.createCustomer({
        email: shopifyCustomer.email,
      });

    if (getCustomerError) {
      return [undefined, getCustomerError];
    }

    let [orderQueueScheduled, orderQueueScheduledError] =
      await this.orderQueueRepository.updateOrderQueue({
        customerId: customer?.id,
        orderNumber: name,
        status: 'scheduled',
      });
    if (orderQueueScheduledError) {
      return [null, orderQueueScheduledError];
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
    const PractitionerBox = 6666539204663;
    if (
      order.products.length > 1 &&
      purchasedProducts.includes(PractitionerBox)
    ) {
      return [
        {
          customerId: orderQueueScheduled.customerId,
          orderNumber: orderQueueScheduled.orderNumber,
          status: orderQueueScheduled.status,
          orderDate: orderQueueScheduled.orderDate,
        },
        null,
      ];
    }
    const [customerOrderCount, getOrderCountError] =
      await this.shopifyRepository.getOrderCount({
        shopifyCustomerId: shopifyCustomer.id,
      });
    if (getOrderCountError) {
      return [null, getOrderCountError];
    }
    const [practitionerAndBox, getPractitionerAndBoxByUuidError] =
      await this.practitionerBoxRepository.getPractitionerAndBoxByUuid({
        practitionerBoxUuid,
      });
    if (getPractitionerAndBoxByUuidError) {
      return [null, getPractitionerAndBoxByUuidError];
    }
    if (!practitionerAndBox.box.products.length) {
      // analyze
      const [nextBoxProductsRes, nextBoxProductsError] =
        await this.getSuggestionUtil.getSuggestion({
          customer,
          productCount: PRODUCT_COUNT,
        });
      orderProducts = nextBoxProductsRes.products.map((product) => {
        return { sku: product.sku };
      });
      if (nextBoxProductsError) {
        return [null, nextBoxProductsError];
      }
    } else {
      orderProducts = practitionerAndBox.box.products;
    }
    if(customerOrderCount.orderCount <= 1){
      orderProducts.push(
        { sku: 'NP-brochure-2022q1' }, //  Uprinting brochure and
        { sku: 'x10278-SHK-SN20156' }, // Teatis Cacao powder
      )
    }

    const transactionPrice: number = Number(subtotal_price);

    const [
      [customerOrder, updateOrderError],
      [practitionerBoxHistory, createPractitionerBoxHistoryError],
      [orderQueueOrdered, orderQueueOrderedError],
    ] = await Promise.all([
      this.shipheroRepository.updateCustomerOrder({
        orderId: order.orderId,
        products: orderProducts,
        orderNumber: name,
      }),
      this.practitionerBoxOrderHistoryRepository.createPractitionerBoxOrderHistory(
        {
          transactionPrice,
          orderNumber: name,
          status: 'ordered',
          customerId: customer?.id,
          practitionerBoxId: practitionerAndBox.box.id,
        },
      ),
      this.orderQueueRepository.updateOrderQueue({
        customerId: customer?.id,
        orderNumber: name,
        status: 'ordered',
      }),
    ]);

    if (updateOrderError) {
      return [null, updateOrderError];
    }
    if (createPractitionerBoxHistoryError) {
      return [null, createPractitionerBoxHistoryError];
    }
    if (orderQueueOrderedError) {
      return [null, orderQueueOrderedError];
    }

    return [
      {
        customerId: orderQueueOrdered.customerId,
        orderNumber: orderQueueOrdered.orderNumber,
        status: orderQueueOrdered.status,
        orderDate: orderQueueOrdered.orderDate,
      },
      null,
    ];
  }
}
