import { Inject, Injectable } from '@nestjs/common';

import { ShipheroRepoInterface } from 'src/repositories/shiphero/shiphero.repository';
import { ProductGeneralRepoInterface } from 'src/repositories/teatisDB/productRepo/productGeneral.repository';
import { CustomerPostPurchaseSurveyRepoInterface } from 'src/repositories/teatisDB/customerRepo/customerPostPurchaseSurvey.repository';
import { PostPurchaseSurvey } from 'src/domains/PostPurchaseSurvey';
import { CustomerGeneralRepoInterface } from 'src/repositories/teatisDB/customerRepo/customerGeneral.repository';
import { CustomerBoxRepoInterface } from 'src/repositories/teatisDB/customerRepo/customerBox.repository';
import { CustomerBox } from 'src/domains/CustomerBox';
import { UpdateCustomerBoxDto } from '../../controllers/discoveries/dtos/updateCustomerBox';

export interface UpdateCustomerBoxUsecaseInterface {
  updateCustomerBox({
    products,
    email,
  }: UpdateCustomerBoxDto): Promise<[CustomerBox, Error]>;
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
    @Inject('CustomerBoxRepoInterface')
    private customerBoxRepo: CustomerBoxRepoInterface,
  ) {}

  async updateCustomerBox({
    products,
    email,
  }: UpdateCustomerBoxDto): Promise<[CustomerBox, Error]> {
    const [
      [customer, customerError],
      [deleteCustomerBoxRes, deleteCustomerBoxError],
    ] = await Promise.all([
      this.customerGeneralRepo.getCustomer({ email }),
      await this.customerBoxRepo.deleteCustomerBox({
        email,
      }),
    ]);

    if (customerError) {
      return [null, customerError];
    } else if (deleteCustomerBoxError) {
      return [null, deleteCustomerBoxError];
    }

    const [postCustomerBoxRes, postCustomerBoxError] =
      await this.customerBoxRepo.postCustomerBox({
        customerId: customer.id,
        products,
      });

    if (postCustomerBoxError) {
      return [null, postCustomerBoxError];
    }

    return [
      {
        status: 'Success',
      },
      null,
    ];
  }
}
