import { Inject, Injectable } from '@nestjs/common';

import { ShipheroRepositoryInterface } from '@Repositories/shiphero/shiphero.repository';

import { UpdateCustomerOrderDto } from '@Controllers/discoveries/dtos/updateCustomerOrder';
import { OrderQueueRepositoryInterface } from '@Repositories/teatisDB/order/orderQueue.repository';
import { Product } from 'src/domains/Product';
import { ShopifyRepositoryInterface } from '@Repositories/shopify/shopify.repository';
import { PractitionerBoxRepositoryInterface } from '@Repositories/teatisDB/practitioner/practitionerBox.repo';
import { OrderQueue } from '@Domains/OrderQueue';
import { PractitionerBoxOrderHistoryRepositoryInterface } from '@Repositories/teatisDB/practitioner/practitionerBoxOrderHistory.repository';
import { ReturnValueType } from '@Filters/customError';
import { CustomerProductsAutoSwapInterface } from '../utils/customerProductsAutoSwap';
import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { PRACTITIONER_BOX_PLANS } from '../utils/practitionerBoxPlan';
import { currentMonth } from '../utils/dates';
import { TEST_PRACTITIONER_BOX_UUIDS } from '../utils/testPractitionerBoxUuids';
import { WebhookEventRepositoryInterface } from '../../repositories/teatisDB/webhookEvent/webhookEvent.repository';
import { ProductGeneralRepositoryInterface } from '../../repositories/teatisDB/product/productGeneral.repository';

interface UpdateCustomerOrderOfPractitionerBoxArgs
  extends Pick<
    UpdateCustomerOrderDto,
    'name' | 'customer' | 'subtotal_price' | 'line_items' | 'admin_graphql_api_id'
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
    admin_graphql_api_id,
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
    @Inject('CustomerProductsAutoSwapInterface')
    private customerProductsAutoSwap: CustomerProductsAutoSwapInterface,
    @Inject('CustomerGeneralRepositoryInterface')
    private customerGeneralRepository: CustomerGeneralRepositoryInterface,
    @Inject('WebhookEventRepositoryInterface')
    private webhookEventRepository: WebhookEventRepositoryInterface,
    @Inject('ProductGeneralRepositoryInterface')
    private productGeneralRepository: ProductGeneralRepositoryInterface,
  ) {}

  async updateCustomerOrderOfPractitionerBox({
    name,
    customer: shopifyCustomer,
    subtotal_price,
    line_items,
    uuid,
    practitionerBoxUuid,
    admin_graphql_api_id: apiId,
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

    // if(isFirstOrder){
    //   orderProducts.push(
    //     { sku: 'NP-brochure-2022q1' }, //  Uprinting brochure and
    //     { sku: 'x10278-SHK-SN20156' }, // Teatis Cacao powder
    //   );
    // }
    let note = undefined;
    if(customer.createAt >= new Date('2022-10-01') && TEST_PRACTITIONER_BOX_UUIDS.includes(practitionerBoxUuid)){
      switch (customerOrderCount.orderCount){
        case 1:
          orderProducts = [
            { sku: 'x10264-BAR-SN20154' },
            { sku: 'x10217-CHP-SN20144' },
            { sku: 'x10362-SWT-SN20187' },
            { sku: 'x10428-CHP-SN20206' },
            { sku: 'x10206-GUM-SN20127' },
            { sku: 'x10404-CHC-SN20199' },
            { sku: 'x10325-JRK-SN20177' },
            { sku: 'x10250-CER-SN20110' },
          ];
          break;
        case 2:
          orderProducts = [
            { sku: 'x10245-GUM-SN20102' },
            { sku: 'x10437-SWT-SN20187' },
            { sku: 'x10300-CHC-SN20172' },
            { sku: 'x10429-CHP-SN20206' },
            { sku: 'x10224-CHP-SN20122' },
            { sku: 'x10427-GRA-SN20205' },
            { sku: 'x10319-SWT-SN20176' },
            { sku: 'x10351-CHP-SN20182' },
          ];
          break;
        case 3: orderProducts = [
          { sku: 'x10266-CHP-SN20115' },
          { sku: 'x10415-CHP-SN20203' },
          { sku: 'x10337-JRK-SN20148' },
          { sku: 'x10225-BAR-SN20154' },
          { sku: 'x10328-BAR-SN20178' },
          { sku: 'x10366-GUM-SN20188' },
          { sku: 'x10213-BAR-SN20123' },
          { sku: 'x10203-CER-SN20110' },
        ];
          break;
        case 4: orderProducts = [
          { sku: 'x10226-CHP-SN20118' },
          { sku: 'x10354-CHC-SN20183' },
          { sku: 'x10324-JRK-SN20177' },
          { sku: 'x10328-BAR-SN20178' },
          { sku: 'x10399-BAR-SN20197' },
          { sku: 'x10365-SWT-SN20187' },
          { sku: 'x10394-JRK-SN20195' },
          { sku: 'x10298-CHC-SN20170' },
        ];
          break;
        case 5: orderProducts = [
          { sku: 'x10403-CHC-SN20199' },
          { sku: 'x10437-SWT-SN20187' },
          { sku: 'x10220-SWT-SN20111' },
          { sku: 'x10272-CHP-SN20144' },
          { sku: 'x10430-CHP-SN20206' },
          { sku: 'x10420-CER-SN20110' },
          { sku: 'x10408-GUM-SN20201' },
          { sku: 'x10390-CHP-SN20194' },
        ];
          break;
        default:
          orderProducts= orderProducts.slice(0, 8);
          break;
      }
      note = 'Please ship with USPS First Class Parcel Only';
    }
    const transactionPrice = Number(subtotal_price);
    const [
      [productOnHand, updateOrderError],
      [, createPractitionerBoxHistoryError],
      [orderQueueOrdered, orderQueueOrderedError],
      [, updateOrderInformationError],
    ] = await Promise.all([
      this.shipheroRepository.updateCustomerOrder({
        orderId: order.orderId,
        products: orderProducts,
        orderNumber: name,
        warehouseCode: 'CLB-DB',
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
      this.shipheroRepository.updateOrderInformation({ orderId: order.orderId, note }),
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
    if(updateOrderInformationError){
      return [undefined, updateOrderInformationError];
    }

    const [, postApiIdError] = await this.webhookEventRepository.postApiId({ apiId });
    if(postApiIdError){
      return [undefined, postApiIdError];
    }

    const fiveOrLessStocks = productOnHand.filter(val => val.onHand <= 5);

    if(fiveOrLessStocks.length){
      const [, updateProductStatusError] = await this.productGeneralRepository.updateProductsStatus(
        {
          isActive: false,
          skus: fiveOrLessStocks.map(({ sku }) => { return sku; }),
        }
      );
      if(updateProductStatusError){
        return [undefined, updateProductStatusError];
      } }
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
