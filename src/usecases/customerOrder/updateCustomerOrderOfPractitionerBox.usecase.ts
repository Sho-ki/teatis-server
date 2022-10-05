import { Inject, Injectable } from '@nestjs/common';

import { ShipheroRepositoryInterface } from '@Repositories/shiphero/shiphero.repository';

import { UpdateCustomerOrderDto } from '@Controllers/discoveries/dtos/updateCustomerOrder';
import { OrderQueueRepositoryInterface } from '@Repositories/teatisDB/order/orderQueue.repository';
import { Product } from 'src/domains/Product';
import { ShopifyRepositoryInterface } from '@Repositories/shopify/shopify.repository';
import { GetSuggestionInterface } from '@Usecases/utils/getSuggestion';
import { PractitionerBoxRepositoryInterface } from '@Repositories/teatisDB/practitioner/practitionerBox.repo';
import { OrderQueue } from '@Domains/OrderQueue';
import { PractitionerBoxOrderHistoryRepositoryInterface } from '@Repositories/teatisDB/practitioner/practitionerBoxOrderHistory.repository';
import { ReturnValueType } from '@Filters/customError';
import { CustomerProductsAutoSwapInterface } from '../utils/customerProductsAutoSwap';
import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { PRACTITIONER_BOX_PLANS } from '../utils/practitionerBoxPlan';
import { currentMonth } from '../utils/dates';
import { TEST_PRACTITIONER_BOX_UUIDS } from '../utils/testPractitionerBoxUuids';

interface UpdateCustomerOrderOfPractitionerBoxArgs
  extends Pick<
    UpdateCustomerOrderDto,
    'name' | 'customer' | 'subtotal_price' | 'line_items'
  > {
  uuid: string;
  practitionerBoxUuid: string;
}

export interface UpdateCustomerOrderOfPractitionerBoxUsecaseInterface {
  updateCustomerOrderOfPractitionerBox({
    name,
    customer,
    subtotal_price,
    line_items,
    uuid,
    practitionerBoxUuid,
  }: UpdateCustomerOrderOfPractitionerBoxArgs): Promise<ReturnValueType<OrderQueue>>;
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
    @Inject('CustomerProductsAutoSwapInterface')
    private customerProductsAutoSwap: CustomerProductsAutoSwapInterface,
   @Inject('CustomerGeneralRepositoryInterface')
    private customerGeneralRepository: CustomerGeneralRepositoryInterface,
  ) {}

  async updateCustomerOrderOfPractitionerBox({
    name,
    customer: shopifyCustomer,
    subtotal_price,
    line_items,
    uuid,
    practitionerBoxUuid,
  }: UpdateCustomerOrderOfPractitionerBoxArgs): Promise<ReturnValueType<OrderQueue>> {
    let [customer, getCustomerError] =
      await this.customerGeneralRepository.getCustomer({ email: shopifyCustomer.email });

    if (getCustomerError) {
      return [undefined, getCustomerError];
    }

    // Swap user's email address if pre-purchase email and payment email are different
    if (!customer.email) {
      [customer, getCustomerError] =
        await this.customerGeneralRepository.updateCustomerEmailByUuid({
          uuid,
          newEmail: shopifyCustomer.email,
        });

      if (getCustomerError) {
        return [undefined, getCustomerError];
      }
    }
    const [orderQueueScheduled, orderQueueScheduledError] =
      await this.orderQueueRepository.updateOrderQueue({
        customerId: customer.id,
        orderNumber: name,
        status: 'scheduled',
      });
    if (orderQueueScheduledError) {
      return [undefined, orderQueueScheduledError];
    }
    const purchasedProducts = line_items.map((lineItem) => {
      return lineItem.product_id;
    });

    const [order, orderError] =
      await this.shipheroRepository.getCustomerOrderByOrderNumber({ orderNumber: name });
    if (orderError) {
      return [undefined, orderError];
    }
    const PractitionerBoxID = 6603694014519;
    if (
      order.products.length > 1 &&
      purchasedProducts.includes(PRACTITIONER_BOX_PLANS.original.id
         || PRACTITIONER_BOX_PLANS.customized.id
         || PractitionerBoxID)
    ) {
      return [
        {
          customerId: orderQueueScheduled.customerId,
          orderNumber: orderQueueScheduled.orderNumber,
          status: orderQueueScheduled.status,
          orderDate: orderQueueScheduled.orderDate,
        },
        undefined,
      ];
    }
    const [customerOrderCount, getOrderCountError] =
      await this.shopifyRepository.getOrderCount({ shopifyCustomerId: shopifyCustomer.id });
    if (getOrderCountError) {
      return [undefined, getOrderCountError];
    }
    const isFirstOrder = customerOrderCount.orderCount === 1;
    const [practitionerAndBox, getPractitionerAndBoxByUuidError] =
      await this.practitionerBoxRepository.getPractitionerAndBoxByUuid({ practitionerBoxUuid });
    if (getPractitionerAndBoxByUuidError) {
      return [undefined, getPractitionerAndBoxByUuidError];
    }
    const practitionerId = practitionerAndBox.id;
    const boxLabel = practitionerAndBox.box.label;

    const [recurringPractitionerBox, getPractitionerRecurringBoxError] =
      await this.practitionerBoxRepository.getPractitionerRecurringBox({ practitionerId, label: `Recurring___${currentMonth()}___${boxLabel}` });
    if (getPractitionerRecurringBoxError) {
      return [undefined, getPractitionerRecurringBoxError];
    }
    const practitionerProducts =
      recurringPractitionerBox.id === 0 || isFirstOrder
        ? practitionerAndBox.box.products
        : recurringPractitionerBox.products;

    const [autoSwapBoxProducts, autoSwapBoxProductsError] =
      await this.customerProductsAutoSwap.customerProductsAutoSwap(
        {
          practitionerProducts,
          customer,
        }
      );
    if (autoSwapBoxProductsError) {
      return [undefined, autoSwapBoxProductsError];
    }
    let orderProducts: Pick<Product, 'sku'>[] = autoSwapBoxProducts;

    if(isFirstOrder){
      orderProducts.push(
        { sku: 'NP-brochure-2022q1' }, //  Uprinting brochure and
        { sku: 'x10278-SHK-SN20156' }, // Teatis Cacao powder
      );
    }
    if(customer.createAt >= new Date('2022-10-01') && TEST_PRACTITIONER_BOX_UUIDS.includes(practitionerBoxUuid)){
      orderProducts= orderProducts.slice(0, 8);
    }
    const transactionPrice = Number(subtotal_price);
    const [
      [, updateOrderError],
      [, createPractitionerBoxHistoryError],
      [orderQueueOrdered, orderQueueOrderedError],
      [, updateOrderHoldUntilDateError],
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
      this.shipheroRepository.updateOrderHoldUntilDate({ orderId: order.orderId }),
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
    if(updateOrderHoldUntilDateError){
      return [undefined, updateOrderHoldUntilDateError];
    }

    return [
      {
        customerId: orderQueueOrdered.customerId,
        orderNumber: orderQueueOrdered.orderNumber,
        status: orderQueueOrdered.status,
        orderDate: orderQueueOrdered.orderDate,
      },
      undefined,
    ];
  }
}
