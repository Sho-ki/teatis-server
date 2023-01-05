/* eslint-disable no-console */
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
import { CustomerProductsAutoSwapInterface } from '@Usecases/utils/customerProductsAutoSwap';
import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { currentMonth } from '@Usecases/utils/dates';
import { TEST_PRACTITIONER_BOX_UUIDS } from '@Usecases/utils/testPractitionerBoxUuids';
import { WebhookEventRepositoryInterface } from '@Repositories/teatisDB/webhookEvent/webhookEvent.repository';
import { ProductGeneralRepositoryInterface } from '@Repositories/teatisDB/product/productGeneral.repository';
import * as ClientOAuth2 from 'client-oauth2';
import { CustomerAuthRepositoryInterface } from '@Repositories/teatisDB/customer/customerAuth.repository';
import { CreateCalendarEventInterface } from '@Usecases/utils/createCalendarEvent';
import { createGoogleOAuthClient } from '@Usecases/utils/OAuthClient';
import { CoachRepositoryInterface } from '../../repositories/teatisDB/coach/coach.repository';

interface UpdateCustomerOrderOfPractitionerBoxArgs
  extends Pick<
    UpdateCustomerOrderDto,
    'name' | 'customer' | 'subtotal_price' | 'admin_graphql_api_id' | 'line_items'
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
    @Inject('CustomerAuthRepositoryInterface')
    private customerAuthRepository: CustomerAuthRepositoryInterface,
    @Inject('CreateCalendarEventInterface')
    private createCalendarEvent: CreateCalendarEventInterface,
    @Inject('CoachRepositoryInterface')
    private coachRepository: CoachRepositoryInterface,

  ) {}

  async updateCustomerOrderOfPractitionerBox({
    name,
    customer: shopifyCustomer,
    subtotal_price,
    uuid,
    line_items,
    practitionerBoxUuid,
    admin_graphql_api_id: apiId,
  }: UpdateCustomerOrderOfPractitionerBoxArgs): Promise<ReturnValueType<OrderQueue>> {
    const [customer, getCustomerError] =
      await this.customerGeneralRepository.getCustomerByUuid({ uuid });

    if (getCustomerError) {
      return [undefined, getCustomerError];
    }

    let phoneNumber = shopifyCustomer.phone || shopifyCustomer?.default_address?.phone;
    if(phoneNumber && phoneNumber.substring(0, 1) !== '+'){
      phoneNumber = '+1' + phoneNumber;
    }
    const changePhone = phoneNumber && customer.phone !== phoneNumber;
    const changeFirstName = shopifyCustomer.first_name && customer.firstName !== shopifyCustomer.first_name;
    const changeLastName = shopifyCustomer.last_name && customer.lastName !== shopifyCustomer.last_name;
    if(changePhone|| changeFirstName || changeLastName){
      await this.customerGeneralRepository.updateCustomerByUuid({
        uuid,
        phone: phoneNumber,
        firstName: shopifyCustomer.first_name,
        lastName: shopifyCustomer.last_name,
      });

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
    const [order, orderError] =
      await this.shipheroRepository.getCustomerOrderByOrderNumber({ orderNumber: name });
    if (orderError) {
      return [undefined, orderError];
    }
    // eslint-disable-next-line no-console
    console.log('order.products', order.products);
    // eslint-disable-next-line no-console
    console.log('order.products.length', order.products.length);
    if (order.products.length > 1) {
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
    // tmp code
    const hasCoachingBox =
    line_items.some(item => item.product_id === 6738837307447 || item.product_id === 6742392340535);

    if(hasCoachingBox && customerOrderCount.orderCount <= 1){ // coaching box

      const [, getConnectCoachError] = await this.coachRepository.
        connectCustomerCoach({ coachEmail: 'coach@teatismeal.com', customerId: customer.id });
      if(getConnectCoachError){
        return [undefined, getConnectCoachError];
      }

      if(customer.boxStatus !== 'active' && customer.coachingStatus !== 'active' ){
        await this.customerGeneralRepository.activateCustomerSubscription({ uuid: customer.uuid, type: ['coachingSubscribed', 'boxSubscribed']  });
      }
    }else {
      if(hasCoachingBox && customer.coachingStatus !== 'active' ){
        if(!customer.coachId){ // Customers who subscribed once without coaching, but subscribed again with coaching
          await this.coachRepository.
            connectCustomerCoach({ coachEmail: 'coach@teatismeal.com', customerId: customer.id });
        }
        await this.customerGeneralRepository.activateCustomerSubscription({ uuid: customer.uuid, type: ['coachingSubscribed']  });
      }
      if(customer.boxStatus !== 'active'){
        await this.customerGeneralRepository.activateCustomerSubscription(
          { uuid: customer.uuid, type: ['boxSubscribed']  }
        );
      }
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
    console.log('customer.createdAt', customer.createdAt);
    console.log('practitionerBoxUuid', practitionerBoxUuid);
    console.log('customerOrderCount.orderCount', customerOrderCount.orderCount);
    if(customer.createdAt >= new Date('2022-10-01') && TEST_PRACTITIONER_BOX_UUIDS.includes(practitionerBoxUuid)){
      switch (customerOrderCount.orderCount){
        case 1:
          orderProducts = [
            { sku: 'x10264-BAR-SN20154' },
            { sku: 'x10217-CHP-SN20144' },
            { sku: 'x10365-SWT-SN20187' },
            { sku: 'x10430-CHP-SN20206' },
            { sku: 'x10206-GUM-SN20127' },
            { sku: 'x10404-CHC-SN20199' },
            { sku: 'x10444-JRK-SN20177' },
            { sku: 'x10250-CER-SN20110' },
            { sku: 'x10443-NP-SN20215' }, // brochure
          ];
          break;
        case 2:
          orderProducts = [
            { sku: 'x10366-GUM-SN20188' },
            { sku: 'x10441-SWT-SN20141' },
            { sku: 'x10319-SWT-SN20176' },
            { sku: 'x10221-CHP-SN20101' },
            { sku: 'x10427-GRA-SN20205' },
            { sku: 'x10437-SWT-SN20187' },
            { sku: 'x10409-JRK-SN20158' },
            { sku: 'x10415-CHP-SN20203' },
          ];
          break;
        case 3: orderProducts = [
          { sku: 'x10266-CHP-SN20115' },
          { sku: 'x10415-CHP-SN20203' },
          { sku: 'x10337-JRK-SN20148' },
          { sku: 'x10225-BAR-SN20154' },
          { sku: 'x10328-BAR-SN20178' },
          { sku: 'x10206-GUM-SN20127' },
          { sku: 'x10213-BAR-SN20123' },
          { sku: 'x10413-COK-SN20113' },
        ];
          break;
        case 4: orderProducts = [
          { sku: 'x10226-CHP-SN20118' },
          { sku: 'x10354-CHC-SN20183' },
          { sku: 'x10324-JRK-SN20177' },
          { sku: 'x10333-BAR-SN20178' },
          { sku: 'x10399-BAR-SN20197' },
          { sku: 'x10365-SWT-SN20187' },
          { sku: 'x10394-JRK-SN20195' },
          { sku: 'x10298-CHC-SN20170' },
        ];
          break;
        case 5: orderProducts = [
          { sku: 'x10405-CHC-SN20199' },
          { sku: 'x10437-SWT-SN20187' },
          { sku: 'x10220-SWT-SN20111' },
          { sku: 'x10351-CHP-SN20182' },
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
      note = 'Please ship with USPS First Class Parcel Only. Please place stickers on each items: NonProduct: Circle sheet labels (select 1 sticker from 2 sizes)';
    }

    if(customer.createdAt >= new Date('2022-12-03') && TEST_PRACTITIONER_BOX_UUIDS.includes(practitionerBoxUuid)){
      switch (customerOrderCount.orderCount){
        case 1:
          orderProducts = [
            { sku: 'x10404-CHC-SN20199' },
            { sku: 'x10430-CHP-SN20206' },
            { sku: 'x10206-GUM-SN20127' },
            { sku: 'x10365-SWT-SN20187' },
            { sku: 'x10217-CHP-SN20144' },
            { sku: 'x10409-JRK-SN20158' },
            { sku: 'x10264-BAR-SN20154' },
          ];
          break;
        case 2:
          orderProducts = [
            { sku: 'x10437-SWT-SN20187' },
            { sku: 'x10441-SWT-SN20141' },
            { sku: 'x10319-SWT-SN20176' },
            { sku: 'x10215-CER-SN20110' },
            { sku: 'x10225-BAR-SN20154' },
            { sku: 'x10328-BAR-SN20178' },
            { sku: 'x10413-COK-SN20113' },
          ];
          break;
        case 3: orderProducts = [
          { sku: 'x10415-CHP-SN20203' },
          { sku: 'x10221-CHP-SN20101' },
          { sku: 'x10430-CHP-SN20206' },
          { sku: 'x10409-JRK-SN20158' },
          { sku: 'x10266-CHP-SN20115' },
          { sku: 'x10337-JRK-SN20148' },
          { sku: 'x10226-CHP-SN20118' },
        ];
          break;
        default:
          orderProducts= orderProducts.slice(0, 7);
          break;
      }
      note = 'Please ship with USPS First Class Parcel Only. Please place stickers on each items: NonProduct: Circle sheet labels (select 1 sticker from 2 sizes)';
    }

    const transactionPrice = Number(subtotal_price);
    const [
      [productOnHand, updateOrderError],
      [, createPractitionerBoxHistoryError],
      [orderQueueOrdered, orderQueueOrderedError],
      [, updateOrderInformationError],
      [customerAuth, getCustomerAuthError],
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
      this.shipheroRepository.updateOrderInformation({ orderId: order.orderId, note, uuid }),
      this.customerAuthRepository.getCustomerAuthToken({ customerId: customer.id, provider: 'google' }),
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
    if(getCustomerAuthError){
      return [undefined, getCustomerAuthError];
    }

    if(customerOrderCount.orderCount >= 2 && customerAuth.isAuthenticated){
      const client:ClientOAuth2 = createGoogleOAuthClient(uuid);
      const token = client.createToken(customerAuth.token, customerAuth.refreshToken, customerAuth.tokenType, {});
      await this.createCalendarEvent.createCalendarEvent({ customer, token });
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
