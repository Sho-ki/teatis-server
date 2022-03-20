import { Inject, Injectable } from '@nestjs/common';

import { ShipheroRepoInterface } from 'src/repositories/shiphero/shiphero.repository';
import { ProductGeneralRepoInterface } from 'src/repositories/teatisDB/productRepo/productGeneral.repository';
import { CustomerPostPurchaseSurveyRepoInterface } from 'src/repositories/teatisDB/customerRepo/customerPostPurchaseSurvey.repository';
import { PostPurchaseSurvey } from 'src/domains/PostPurchaseSurvey';
import { CustomerGeneralRepoInterface } from 'src/repositories/teatisDB/customerRepo/customerGeneral.repository';
import { CustomerBoxRepoInterface } from 'src/repositories/teatisDB/customerRepo/customerBox.repository';
import { CustomerBox } from 'src/domains/CustomerBox';
import { DeleteCustomerBoxDto } from '../../controllers/discoveries/dtos/deleteCustomerBox';

export interface DeleteCustomerBoxUsecaseInterface {
  deleteCustomerBox({
    email,
  }: DeleteCustomerBoxDto): Promise<[CustomerBox, Error]>;
}

@Injectable()
export class DeleteCustomerBoxUsecase
  implements DeleteCustomerBoxUsecaseInterface
{
  constructor(
    @Inject('CustomerBoxRepoInterface')
    private customerBoxRepo: CustomerBoxRepoInterface,
  ) {}

  // need to delete CustomerBox every time products are shipped, since customers may not answer the next post-purchase-survey
  // which causes sending the same products as the previous order
  async deleteCustomerBox({
    email,
  }: DeleteCustomerBoxDto): Promise<[CustomerBox, Error]> {
    const [deleteCustomerBox, deleteCustomerBoxError] =
      await this.customerBoxRepo.deleteCustomerBox({
        email,
      });
    if (deleteCustomerBoxError) {
      return [null, deleteCustomerBoxError];
    }

    return [{ status: 'Success' }, null];
  }
}
