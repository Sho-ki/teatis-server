import { Inject, Injectable } from '@nestjs/common';

import { ShipheroRepoInterface } from '@Repositories/shiphero/shiphero.repository';

import { UpdateCustomerOrderDto } from '@Controllers/discoveries/dtos/updateCustomerOrder';
import { OrderQueueRepoInterface } from '@Repositories/teatisDB/orderRepo/orderQueue.repository';
import { Product } from 'src/domains/Product';
import { ShopifyRepoInterface } from '@Repositories/shopify/shopify.repository';
import { GetSuggestionInterface } from '@Usecases/utils/getSuggestion';
import { PractitionerBoxRepoInterface } from '@Repositories/teatisDB/practitionerRepo/practitionerBox.repo';
import { OrderQueue } from '@Domains/OrderQueue';
import { PractitionerBoxOrderHistoryRepoInterface } from '@Repositories/teatisDB/practitionerRepo/practitionerBoxOrderHistory.repository';
import { CustomerGeneralRepoInterface } from '@Repositories/teatisDB/customerRepo/customerGeneral.repository';

interface UpdateCustomerOrderOfPractitionerMealBoxArgs
  extends Pick<
    UpdateCustomerOrderDto,
    'name' | 'customer' | 'subtotal_price' | 'line_items'
  > {
  uuid: string;
  practitionerBoxUuid: string;
}

export interface UpdateCustomerOrderOfPractitionerMealBoxUsecaseInterface {
  updateCustomerOrderOfPractitionerMealBox({
    name,
    customer,
    subtotal_price,
    line_items,
    uuid,
    practitionerBoxUuid,
  }: UpdateCustomerOrderOfPractitionerMealBoxArgs): Promise<
    [OrderQueue?, Error?]
  >;
}

@Injectable()
export class UpdateCustomerOrderOfPractitionerMealBoxUsecase
  implements UpdateCustomerOrderOfPractitionerMealBoxUsecaseInterface
{
  constructor(
    @Inject('ShipheroRepoInterface')
    private shipheroRepo: ShipheroRepoInterface,
    @Inject('PractitionerBoxOrderHistoryRepoInterface')
    private practitionerBoxOrderHistoryRepo: PractitionerBoxOrderHistoryRepoInterface,
    @Inject('OrderQueueRepoInterface')
    private orderQueueRepo: OrderQueueRepoInterface,
    @Inject('PractitionerBoxRepoInterface')
    private practitionerBoxRepo: PractitionerBoxRepoInterface,
    @Inject('ShopifyRepoInterface')
    private readonly shopifyRepo: ShopifyRepoInterface,
    @Inject('GetSuggestionInterface')
    private getSuggestionUtil: GetSuggestionInterface,
    @Inject('CustomerGeneralRepoInterface')
    private customerGeneralRepo: CustomerGeneralRepoInterface,
  ) {}

  async updateCustomerOrderOfPractitionerMealBox({
    name,
    customer: shopifyCustomer,
    subtotal_price,
    line_items,
    uuid,
    practitionerBoxUuid,
  }: UpdateCustomerOrderOfPractitionerMealBoxArgs): Promise<
    [OrderQueue?, Error?]
  > {
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
        return [undefined, getCustomerError];
      }
    }

    let [orderQueueScheduled, orderQueueScheduledError] =
      await this.orderQueueRepo.updateOrderQueue({
        customerId: customer?.id,
        orderNumber: name,
        status: 'scheduled',
      });
    if (orderQueueScheduledError) {
      return [undefined, orderQueueScheduledError];
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
      return [undefined, orderError];
    }
    const PractitionerMealBox = 6603694014519;
    if (
      order.products.length > 1 &&
      purchasedProducts.includes(PractitionerMealBox)
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
      return [undefined, getOrderCountError];
    }
    const [practitionerSingleBox, getPractitionerSingleBoxByUuidError] =
      await this.practitionerBoxRepo.getPractitionerSingleBoxByUuid({
        practitionerBoxUuid,
      });
    if (getPractitionerSingleBoxByUuidError) {
      return [undefined, getPractitionerSingleBoxByUuidError];
    }
    if (!practitionerSingleBox.box.products.length) {
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
        return [undefined, nextBoxProductsError];
      }
    } else {
      orderProducts = practitionerSingleBox.box.products;
    }
    customerOrderCount.orderCount <= 1
      ? orderProducts.push(
          { sku: 'NP-brochure-2022q1' }, //  Uprinting brochure and
          { sku: 'NP-packagingtape' }, // Packaging Tape
          { sku: 'x10278-SHK-SN20156' }, // Teatis Cacao powder
        )
      : orderProducts.push({ sku: 'NP-packagingtape' }); //   Packaging Tape

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
      this.practitionerBoxOrderHistoryRepo.createPractitionerBoxOrderHistory({
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
      return [undefined, updateOrderError];
    }
    if (createPractitionerBoxHistoryError) {
      return [undefined, createPractitionerBoxHistoryError];
    }
    if (orderQueueOrderedError) {
      return [undefined, orderQueueOrderedError];
    }

    return [
      {
        customerId: orderQueueOrdered.customerId,
        orderNumber: orderQueueOrdered.orderNumber,
        status: orderQueueOrdered.status,
        orderDate: orderQueueOrdered.orderDate,
      },
    ];
  }
}
