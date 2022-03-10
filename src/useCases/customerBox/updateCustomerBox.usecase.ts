import { Inject, Injectable } from '@nestjs/common';

import { ShipheroRepoInterface } from '../../repositories/shiphero/shiphero.repository';
import { ProductGeneralRepoInterface } from '../../repositories/teatisDB/productRepo/productGeneral.repository';
import {
  CustomerPostPurchaseSurveyRepoInterface,
  GetCustomerProductFeedbackAnswersRes as TeatisDBGetCustomerProductFeedbackAnswersRes,
  GetCustomerRes as TeatisDBGetCustomerRes,
} from '../../repositories/teatisDB/customerRepo/customerPostPurchaseSurvey.repository';
import { PostPurchaseSurvey } from '../../domains/PostPurchaseSurvey';
import { CustomerGeneralRepoInterface } from '../../repositories/teatisDB/customerRepo/customerGeneral.repository';
import { CustomerUpdateCustomerBoxRepoInterface } from '../../repositories/teatisDB/customerRepo/customerUpdateCustomerBox.repository';
import { UpdateCustomerBox } from '../../domains/updateCustomerBox';

interface UpdateCustomerBoxUsecaseArgs {
  orderNumber: string;
  email: string;
}

export interface UpdateCustomerBoxUsecaseInterface {
  updateCustomerBox({
    orderNumber,
    email,
  }: UpdateCustomerBoxUsecaseArgs): Promise<[UpdateCustomerBox, Error]>;
}

@Injectable()
export class UpdateCustomerBoxUsecase
  implements UpdateCustomerBoxUsecaseInterface
{
  constructor(
    @Inject('ShipheroRepoInterface')
    private shipheroRepo: ShipheroRepoInterface,
    @Inject('CustomerGeneralRepoInterface')
    private customerGeneralRepo: CustomerGeneralRepoInterface,
    @Inject('ProductGeneralRepoInterface')
    private productGeneralRepo: ProductGeneralRepoInterface,
    @Inject('CustomerPostPurchaseSurveyRepoInterface')
    private customerPostPurchaseSurveyRepo: CustomerPostPurchaseSurveyRepoInterface,
    @Inject('CustomerUpdateCustomerBoxRepoInterface')
    private customerUpdateCustomerBoxRepo: CustomerUpdateCustomerBoxRepoInterface,
  ) {}

  async updateCustomerBox({
    orderNumber,
    email,
  }: UpdateCustomerBoxUsecaseArgs): Promise<[UpdateCustomerBox, Error]> {
    // Get last order products from shiphero
    console.log(orderNumber);
    orderNumber = '#3988';
    email = 'shoki0116.highjump@gmail.com';
    const [[order, orderError]] = await Promise.all([
      this.shipheroRepo.getOrderByOrderNumber({ orderNumber }),
    ]);
    if (orderError) {
      return [null, orderError];
    }
    let productSkus: string[] = order.products.map((product) => {
      return product.sku;
    });

    const [upsertedProducts, upsertProductsError] =
      await this.productGeneralRepo.upsertProducts({
        skus: productSkus,
      });
    if (upsertProductsError) {
      return [null, upsertProductsError];
    }

    const [customer, getCustomerError] =
      await this.customerGeneralRepo.getCustomer({
        email,
      });
    if (getCustomerError) {
      return [null, getCustomerError];
    }

    const [
      [deleteCustomerBoxRes, deleteCustomerBoxError],
      [postCustomerBoxRes, postCustomerBoxError],
    ] = await Promise.all([
      this.customerUpdateCustomerBoxRepo.deleteCustomerBox({
        customerId: customer.id,
      }),
      this.customerUpdateCustomerBoxRepo.postCustomerBox({
        customerId: customer.id,
        dbProducts: upsertedProducts.data.map((product) => {
          return { id: product.id, externalSku: product.externalSku };
        }),
      }),
    ]);
    if (deleteCustomerBoxError) {
      return [null, deleteCustomerBoxError];
    } else if (postCustomerBoxError) {
      return [null, postCustomerBoxError];
    }

    return [
      {
        customer: customer.id,
        deleteCount: deleteCustomerBoxRes.deletedCount,
        postCount: postCustomerBoxRes.postCount,
      },
      null,
    ];
  }
}
