import { Inject, Injectable } from '@nestjs/common';
import { Status } from '@Domains/Status';
import { ReturnValueType } from '@Filters/customError';
import { CronMetaDataRepositoryInterface } from '@Repositories/teatisDB/webhookEvent/cronMetaData.repository';
import { ShopifyRepositoryInterface } from '@Repositories/shopify/shopify.repository';
import { WebhookEventRepositoryInterface } from '@Repositories/teatisDB/webhookEvent/webhookEvent.repository';
import { UpdateCustomerOrderOfPractitionerBoxUsecaseInterface } from '../customerOrder/updateCustomerOrderOfPractitionerBox.usecase';
import { UpdateCustomerOrderOfCustomerBoxUsecaseInterface } from '../customerOrder/updateCustomerOrderOfCustomerBox.usecase';
import { SHOPIFY_WEBHOOK_EVENT_NAME } from '../utils/webhookEventName';

export interface CheckUpdateOrderUsecaseInterface {
  checkUpdateOrder(): Promise<ReturnValueType<Status>>;
}

@Injectable()
export class CheckUpdateOrderUsecase
implements CheckUpdateOrderUsecaseInterface
{
  constructor(
    @Inject('CronMetaDataRepositoryInterface')
    private readonly cronMetaDataRepository: CronMetaDataRepositoryInterface,
     @Inject('ShopifyRepositoryInterface')
    private readonly shopifyRepository: ShopifyRepositoryInterface,
    @Inject('WebhookEventRepositoryInterface')
    private readonly webhookEventRepository: WebhookEventRepositoryInterface,
     @Inject('UpdateCustomerOrderOfPractitionerBoxUsecaseInterface')
    private readonly updateCustomerOrderOfPractitionerBoxUsecase: UpdateCustomerOrderOfPractitionerBoxUsecaseInterface,
    @Inject('UpdateCustomerOrderOfCustomerBoxUsecaseInterface')
    private readonly updateCustomerOrderOfCustomerBoxUsecase: UpdateCustomerOrderOfCustomerBoxUsecaseInterface,
  ) {}

  async checkUpdateOrder(): Promise<ReturnValueType<Status>> {
    const [cronMetaData, getCronMetaDataError] = await this.cronMetaDataRepository.getLastRun(
      { name: SHOPIFY_WEBHOOK_EVENT_NAME.updateOrder });
    if(getCronMetaDataError){
      return [undefined, getCronMetaDataError];
    }
    const [shopifyWebhooks, getShopifyWebhooksError] =
    await this.shopifyRepository.getShopifyWebhooks({ fromDate: cronMetaData.lastRunAt });
    if(getShopifyWebhooksError){
      return [undefined, getShopifyWebhooksError];
    }

    const runDate = new Date();
    if(!shopifyWebhooks.length) {
      await this.cronMetaDataRepository.updateLastRun({ date: runDate, name: SHOPIFY_WEBHOOK_EVENT_NAME.updateOrder });
      return [{ success: true }];
    }

    const [apiIds, getApiIdsError] = await this.webhookEventRepository.getApiIds({ fromDate: cronMetaData.lastRunAt });
    if(getApiIdsError){
      return [undefined, getApiIdsError];
    }

    const apiIdsSet = new Set(apiIds.map(({ apiId }) => { return apiId; }));

    const uncompletedWebhooks = shopifyWebhooks.filter(({ apiId }) => {
      return !apiIdsSet.has(apiId);
    });

    for(const webhook of uncompletedWebhooks){
      const { orderNumber, lineItems, apiId, attributes, shopifyCustomer, totalPrice } = webhook;

      let customerAttributes = {} as { uuid?: string, practitionerBoxUuid?: string };
      for (const attribute of attributes) {
        if (attribute.name === 'uuid') {
          customerAttributes = Object.assign(customerAttributes, { uuid: attribute.value });
        }
        if (attribute.name === 'practitionerBoxUuid') {
          customerAttributes = Object.assign(customerAttributes, { practitionerBoxUuid: attribute.value });
        }
      }
      const attributeKeys = Object.keys(customerAttributes);
      if (
        attributeKeys.includes('practitionerBoxUuid') &&
      attributeKeys.includes('uuid')
      ) {
        await this.updateCustomerOrderOfPractitionerBoxUsecase.updateCustomerOrderOfPractitionerBox(
          {
            name: orderNumber,
            customer: shopifyCustomer,
            subtotal_price: totalPrice,
            uuid: customerAttributes.uuid,
            line_items: lineItems.map(({ productId }) => { return { product_id: productId }; }),
            practitionerBoxUuid: customerAttributes.practitionerBoxUuid,
            admin_graphql_api_id: apiId,
          },
        );
      } else {
        await this.updateCustomerOrderOfCustomerBoxUsecase.updateCustomerOrderOfCustomerBox(
          {
            name: orderNumber,
            customer: shopifyCustomer,
            line_items: lineItems.map(({ productId }) => { return { product_id: productId }; }),
            uuid: customerAttributes.uuid,
            admin_graphql_api_id: apiId,
          },
        );
      }
    }
    await this.cronMetaDataRepository.updateLastRun({ date: runDate, name: SHOPIFY_WEBHOOK_EVENT_NAME.updateOrder });
    return [{ success: true }];
  }
}
