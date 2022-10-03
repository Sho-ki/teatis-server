import { Inject, Injectable } from '@nestjs/common';
import { Status } from '@Domains/Status';
import { ReturnValueType } from '@Filters/customError';
import { CronMetaDataRepositoryInterface } from '@Repositories/teatisDB/webhookEvent/cronMetaData.repository';
import { ShopifyRepositoryInterface } from '@Repositories/shopify/shopify.repository';
import { WebhookEventRepositoryInterface } from '@Repositories/teatisDB/webhookEvent/webhookEvent.repository';
import { SystemRepositoryInterface } from '@Repositories/system/system.repository';

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
     @Inject('SystemRepositoryInterface')
    private readonly systemRepository: SystemRepositoryInterface,

  ) {}

  async checkUpdateOrder(): Promise<ReturnValueType<Status>> {
    const [cronMetaData, getCronMetaDataError] = await this.cronMetaDataRepository.getLastRun({ name: 'updateOrder' });
    if(getCronMetaDataError){
      return [undefined, getCronMetaDataError];
    }
    const [shopifyWebhooks, getShopifyWebhooksError] =
    await this.shopifyRepository.getShopifyWebhooks({ fromDate: cronMetaData.lastRunAt });
    if(getShopifyWebhooksError){
      return [undefined, getShopifyWebhooksError];
    }

    if(!shopifyWebhooks.length) {
      await this.cronMetaDataRepository.updateLastRun({ date: new Date(), name: 'updateOrder' });
      return [{ success: true }];
    }

    const [apiIds, getApiIdsError] = await this.webhookEventRepository.getApiIds({ fromDate: cronMetaData.lastRunAt });
    if(getApiIdsError){
      return [undefined, getApiIdsError];
    }

    const uncompletedWebhooks = shopifyWebhooks.filter(({ apiId }) => { return !apiIds.includes({ apiId }); });

    for(const webhook of uncompletedWebhooks){
      const { orderNumber, lineItems, apiId, attributes, shopifyCustomer, totalPrice } = webhook;
      await this.systemRepository.updateOrderWebhookProduct(
        { orderNumber, lineItems, apiId, attributes, totalPrice, customer: shopifyCustomer });
    }
    await this.cronMetaDataRepository.updateLastRun({ date: new Date(), name: 'updateOrder' });
    return [{ success: true }];
  }
}
