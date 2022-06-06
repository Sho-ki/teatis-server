import { Inject, Injectable } from '@nestjs/common';

import { ShipheroRepoInterface } from '@Repositories/shiphero/shiphero.repository';
import { CustomerBoxRepoInterface } from '@Repositories/teatisDB/customerRepo/customerBox.repository';

import { UpdateCustomerOrderDto } from '@Controllers/discoveries/dtos/updateCustomerOrder';
import { OrderQueueRepoInterface } from '@Repositories/teatisDB/orderRepo/orderQueue.repository';
import { Product } from 'src/domains/Product';
import { ShopifyRepoInterface } from '@Repositories/shopify/shopify.repository';
import { GetNextBoxInterface } from '@Usecases/utils/getNextBox';
import { CreateCustomerUsecaseInterface } from '../utils/createCustomer';
import { PractitionerBoxRepoInterface } from '@Repositories/teatisDB/practitionerRepo/practitionerBox.repo';
import { OrderQueue } from '@Domains/OrderQueue';
import { CustomerOrderHistoryRepoInterface } from '../../repositories/teatisDB/customerRepo/customerOrderHistory.repository';
import { PractitionerGeneralRepoInterface } from '../../repositories/teatisDB/practitionerRepo/practitionerGeneral.repository';

export interface UpdateCustomerOrderByPractitionerBoxUuidUsecaseInterface {
  updateCustomerOrderByPractitionerBoxUuid({
    name,
    customer,
    subtotal_price,
    line_items,
    note_attributes,
  }: UpdateCustomerOrderDto): Promise<[OrderQueue, Error]>;
}

@Injectable()
export class UpdateCustomerOrderByPractitionerBoxUuidUsecase
  implements UpdateCustomerOrderByPractitionerBoxUuidUsecaseInterface
{
  constructor(
    @Inject('ShipheroRepoInterface')
    private shipheroRepo: ShipheroRepoInterface,
    @Inject('CustomerOrderHistoryRepoInterface')
    private customerOrderHistoryRepo: CustomerOrderHistoryRepoInterface,
    @Inject('OrderQueueRepoInterface')
    private orderQueueRepo: OrderQueueRepoInterface,
    @Inject('PractitionerBoxRepoInterface')
    private practitionerBoxRepo: PractitionerBoxRepoInterface,
    @Inject('ShopifyRepoInterface')
    private readonly shopifyRepo: ShopifyRepoInterface,
    @Inject('GetNextBoxInterface')
    private nextBoxUtil: GetNextBoxInterface,
    @Inject('CreateCustomerUsecaseInterface')
    private createCustomerUtil: CreateCustomerUsecaseInterface,
  ) {}

  async updateCustomerOrderByPractitionerBoxUuid({
    name,
    customer: shopifyCustomer,
    subtotal_price,
    line_items,
    note_attributes,
  }: UpdateCustomerOrderDto): Promise<[OrderQueue, Error]> {
    let [customer, getCustomerError] =
      await this.createCustomerUtil.createCustomer({
        email: shopifyCustomer.email,
      });

    if (getCustomerError) {
      return [undefined, getCustomerError];
    }

    let [orderQueueScheduled, orderQueueScheduledError] =
      await this.orderQueueRepo.updateOrderQueue({
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
      await this.shipheroRepo.getCustomerOrderByOrderNumber({
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
      await this.shopifyRepo.getOrderCount({
        shopifyCustomerId: shopifyCustomer.id,
      });
    if (getOrderCountError) {
      return [null, getOrderCountError];
    }
    const [practitionerSingleBox, getPractitionerSingleBoxByUuidError] =
      await this.practitionerBoxRepo.getPractitionerSingleBoxByUuid({
        practitionerBoxUuid: note_attributes[0].value,
      });
    if (getPractitionerSingleBoxByUuidError) {
      return [null, getPractitionerSingleBoxByUuidError];
    }
    if (!practitionerSingleBox.box.products.length) {
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
      orderProducts = practitionerSingleBox.box.products;
    }
    customerOrderCount.orderCount <= 1
      ? orderProducts.push(
          { sku: 'NP-brochure-2022q1' }, //  Uprinting brochure and
          { sku: 'NP-carton-lightblue' }, // Uprinting designed boxes
          { sku: 'x10278-SHK-SN20156' }, // Teatis Cacao powder
        )
      : orderProducts.push({ sku: 'NP-carton-lightblue' }); //   Uprinting designed boxes
    const transactionPrice: number = Number(subtotal_price);
    const [
      [customerOrder, updateOrderError],
      [practitionerBoxHistory, createPractitionerBoxHistoryError],
      [orderQueueOrdered, orderQueueOrderedError],
    ] = await Promise.all([
      this.shipheroRepo.updateCustomerOrder({
        orderId: order.orderId,
        products: orderProducts,
        orderNumber: name,
      }),
      this.customerOrderHistoryRepo.createPractitionerBoxOrderHistory({
        transactionPrice,
        orderNumber: name,
        status: 'ordered',
        customerId: customer?.id,
        practitionerBoxId: practitionerSingleBox.box.id,
      }),
      this.orderQueueRepo.updateOrderQueue({
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