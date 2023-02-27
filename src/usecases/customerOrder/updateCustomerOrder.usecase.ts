/* eslint-disable no-console */
import { Inject, Injectable } from '@nestjs/common';

import { ShipheroRepositoryInterface } from '@Repositories/shiphero/shiphero.repository';

import { ShopifyRepositoryInterface } from '@Repositories/shopify/shopify.repository';
import { ReturnValueType } from '@Filters/customError';
import { CustomerProductsAutoSwapInterface } from '@Usecases/utils/customerProductsAutoSwap';
import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { WebhookEventRepositoryInterface } from '@Repositories/teatisDB/webhookEvent/webhookEvent.repository';
import * as ClientOAuth2 from 'client-oauth2';
import { CustomerAuthRepositoryInterface } from '@Repositories/teatisDB/customer/customerAuth.repository';
import { CreateCalendarEventInterface } from '@Usecases/utils/createCalendarEvent';
import { CoachRepositoryInterface } from '@Repositories/teatisDB/coach/coach.repository';
import { CronMetaDataRepositoryInterface } from '@Repositories/teatisDB/webhookEvent/cronMetaData.repository';
import { MonthlySelectionRepositoryInterface } from '@Repositories/teatisDB/monthlySelection/monthlySelection.repository';
import { CustomerOrder } from '../../domains/CustomerOrder';
import { createGoogleOAuthClient } from '../utils/OAuthClient';
import { CustomerEventLogRepositoryInterface } from '@Repositories/teatisDB/customerEventLog/customerEventLog.repository';
import { ProductGeneralRepositoryInterface } from '@Repositories/teatisDB/product/productGeneral.repository';
import { getDateTimeString } from '../utils/dates';

export interface UpdateCustomerOrderUsecaseInterface {
  updateCustomerOrder(): Promise<ReturnValueType<CustomerOrder[]>>;
}

@Injectable()
export class UpdateCustomerOrderUsecase
implements UpdateCustomerOrderUsecaseInterface
{
  private updateCustomerOrderErrors:Error[] = [];

  constructor(
    @Inject('ShipheroRepositoryInterface')
    private shipheroRepository: ShipheroRepositoryInterface,
    @Inject('ShopifyRepositoryInterface')
    private shopifyRepository: ShopifyRepositoryInterface,
    @Inject('CustomerProductsAutoSwapInterface')
    private customerProductsAutoSwap: CustomerProductsAutoSwapInterface,
    @Inject('CustomerGeneralRepositoryInterface')
    private customerGeneralRepository: CustomerGeneralRepositoryInterface,
    @Inject('ProductGeneralRepositoryInterface')
    private productGeneralRepository: ProductGeneralRepositoryInterface,
    @Inject('WebhookEventRepositoryInterface')
    private webhookEventRepository: WebhookEventRepositoryInterface,
    @Inject('CustomerAuthRepositoryInterface')
    private customerAuthRepository: CustomerAuthRepositoryInterface,
    @Inject('CreateCalendarEventInterface')
    private createCalendarEvent: CreateCalendarEventInterface,
    @Inject('CoachRepositoryInterface')
    private coachRepository: CoachRepositoryInterface,
    @Inject('CronMetaDataRepositoryInterface')
    private cronMetaDataRepository: CronMetaDataRepositoryInterface,
    @Inject('MonthlySelectionRepositoryInterface')
    private monthlySelectionRepository: MonthlySelectionRepositoryInterface,
    @Inject('CustomerEventLogRepositoryInterface')
    private customerEventLogRepository: CustomerEventLogRepositoryInterface,

  ) {}

  private async checkAndCreateCalendar({ uuid, customerId, email }){
    try{
      console.log('uuid, customerId, email', { uuid, customerId, email });
      const [lastCalendarCreatedDate, customerAuth] =
      await Promise.all([this.customerEventLogRepository.getCustomerEventLog({ customerId, event: 'postPurchaseCalendarCreated' }), this.customerAuthRepository.getCustomerAuthToken({ customerId, provider: 'google' })]);

      // When this order is their first order, they are supposed to create the calendar event at UI
      if(customerAuth && lastCalendarCreatedDate){
        const today = new Date();
        const lastCreated = lastCalendarCreatedDate.eventDate || today;
        const elapsedTime = today.getTime() - lastCreated.getTime();
        const daysSinceLastCreated = Math.floor(elapsedTime / 86400000);

        if(daysSinceLastCreated >= 28){
          const client:ClientOAuth2 = createGoogleOAuthClient(uuid);
          const token = client.createToken(
            customerAuth.accessToken, customerAuth.refreshToken, customerAuth.tokenType, {});
          await this.createCalendarEvent.createCalendarEvent({ customerId, uuid, email, token });
        }
      }
    }catch(e){
      this.updateCustomerOrderErrors.push({
        name: 'checkAndCreateCalendar Error',
        message: `input: ${{ uuid, customerId, email }}, error: ${e}`,
      });
    }
  }

  async updateCustomerOrder(): Promise<ReturnValueType<CustomerOrder[]>> {
    const runDate = new Date();
    try{
      const lastRun = await this.cronMetaDataRepository.getLastRun(
        { name: 'updateOrder' });
      const shopifyWebhooks =
      await this.shopifyRepository.getShopifyOrdersByFromDate({ fromDate: lastRun.lastRunAt });
      console.log('shopifyWebhooks:', shopifyWebhooks);

      // const shopifyWebhooks = [
      //   {
      //     orderNumber: '12345',
      //     apiId: 'test123',
      //     attributes: [{ name: 'uuid', value: '9cd8faae-db10-4167-a5a0-583ee9d2afff' }],
      //     lineItems: [{ sku: '1m-mini-coach' }],
      //     totalPrice: '123',
      //     shopifyCustomer: {
      //       email: 'shoki@teatismeal.com', id: 123, phone: '+17433741000', first_name: 'shoki', last_name: 'ishii',
      //       default_address: { phone: '+17433741000' },
      //     },
      //   },
      // ];
      if(!shopifyWebhooks.length) {
        await this.cronMetaDataRepository.updateLastRun({ date: runDate, name: 'updateOrder' });
        return [[]];
      }
      const customerOrders:CustomerOrder[] = [];
      for(const task of shopifyWebhooks){
        try{
          const { orderNumber, apiId, attributes, lineItems, shopifyCustomer, totalPrice } = task;

          const [, postApiIdError] = await this.webhookEventRepository.postApiId(
            { apiId, name: 'updateOrder', client: 'shopify' });

          if(postApiIdError){ // This will happen when an order is already proceeded
            continue;
          }

          const { name, value } = attributes.find(({ name }) => name === 'uuid') || {};
          const [customer] = name ? await this.customerGeneralRepository.getCustomerByUuid({ uuid: value }) :
            await this.customerGeneralRepository.getCustomer({ email: shopifyCustomer.email }); // This will happen when an order is placed by early customers
          const uuid = customer.uuid;

          let phoneNumber = shopifyCustomer?.phone || shopifyCustomer?.default_address?.phone;
          if (phoneNumber && !phoneNumber.startsWith('+')) {
            phoneNumber = '+1' + phoneNumber;
          }

          const changes:{phone?:string, firstName?:string, lastName?:string} = {};
          if (phoneNumber && customer?.phone !== phoneNumber) {
            changes.phone = phoneNumber;
          }

          if (shopifyCustomer.first_name && !customer?.firstName) {
            changes.firstName = shopifyCustomer.first_name;
          }

          if (shopifyCustomer.last_name && !customer?.lastName) {
            changes.lastName = shopifyCustomer.last_name;
          }
          let isUniquePhone = true;
          if (Object.keys(changes).length) {
            const [, updateCustomerByUuidError] = await this.customerGeneralRepository.updateCustomerByUuid({
              uuid,
              ...changes,
            });

            if(updateCustomerByUuidError) isUniquePhone = false;
          }

          let hasCoachingBox = false;

          let boxPlan: 'mini' | 'standard' | 'max' = undefined;

          // for existing customers who paid $24.44, $39.99 without coaching
          boxPlan = Number(totalPrice) > 30?'standard':'mini';

          for(let { sku } of lineItems){
            sku = sku.toLowerCase();
            if(sku.includes('mini')) boxPlan = 'mini';
            else if(sku.includes('standard')) boxPlan = 'standard';

            if(sku.includes('coach')) hasCoachingBox = true;
          }

          // new coaching customers (it doesn't matter if they have purchased non-coaching boxes) &
          // customers who had subscribed the coaching before and re-subscribe the coaching

          if(isUniquePhone && hasCoachingBox && customer.coachingSubscribed === 'inactive'){
            if(!customer.coachId){
              await this.coachRepository.
                connectCustomerCoach({ coachEmail: 'coach@teatismeal.com', customerId: customer.id });
            }
            await this.customerGeneralRepository.activateCustomerSubscription({ uuid: customer.uuid, type: ['coachingSubscribed', 'boxSubscribed']  });

          }
          const [monthlyBoxSelection] =
          await this.monthlySelectionRepository.getMonthlySelection({ date: new Date(), boxPlan });

          // eslint-disable-next-line prefer-const
          let [boxProducts, swapError] =
            await this.customerProductsAutoSwap.customerProductsAutoSwap(
              {
                products: monthlyBoxSelection.products,
                customer,
                count: monthlyBoxSelection.products.length,
              }
            );
          if (!boxProducts.length || swapError) {
            boxProducts =  monthlyBoxSelection.products;
          }

          const [order, orderError] = await this.shipheroRepository.getCustomerOrderByOrderNumber({ orderNumber });
          if (orderError) {
            continue;
          }
          let note:string;
          if(boxPlan === 'mini'){
            note ='Please ship with USPS First Class Parcel Only. Please place stickers on each items: NonProduct: Circle sheet labels (select 1 sticker from 2 sizes)';
          }else {
            note ='Please place stickers on each items: NonProduct: Circle sheet labels (select 1 sticker from 2 sizes)';
          }
          const requiredShipDate = getDateTimeString(48);
          const holdUntilDate = getDateTimeString(24);
          const [
            productOnHand,
            ,
          ] = await Promise.all([
            this.shipheroRepository.updateCustomerOrder({
              orderId: order.orderId,
              products: boxProducts,
              orderNumber,
              warehouseCode: 'CLB-DB',
            }),

            this.shipheroRepository.updateOrderInformation(
              { orderId: order.orderId, note, uuid, holdUntilDate, requiredShipDate }),
          ]);

          const fiveOrLessStocks = productOnHand.filter(val => val.onHand <= 5);
          console.log('fiveOrLessStocks: ', fiveOrLessStocks);

          const inactivateTarget = fiveOrLessStocks.filter(({ sku }) => {
            return !sku.includes('mini')||!sku.includes('standard')||!sku.includes('box');
          });
          if(inactivateTarget.length){
            await this.productGeneralRepository.updateProductsStatus(
              {
                activeStatus: 'inactive',
                skus: inactivateTarget.map(({ sku }) => { return sku; }),
              }
            );
          }

          await this.checkAndCreateCalendar(
            { uuid: customer.uuid, email: customer.email, customerId: customer.id });

          customerOrders.push({ ...order, products: boxProducts });

        }catch(e){
          this.updateCustomerOrderErrors.push({
            name: 'updateCustomerOrder failed',
            message: `input: apiId=${task.apiId}, error: ${e}`,
          });
        }
      }

      if(this.updateCustomerOrderErrors.length){
        throw (this.updateCustomerOrderErrors);
      }

      return [customerOrders];

    }catch(e){
      console.log(e);
      throw new Error(e);
    }finally{
      await this.cronMetaDataRepository.updateLastRun({ date: runDate, name: 'updateOrder' });
    }
  }
}
