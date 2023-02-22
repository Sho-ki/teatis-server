import {  Inject, Injectable } from '@nestjs/common';
import { ReturnValueType } from '@Filters/customError';
import { CustomerGeneralRepositoryInterface } from '../../repositories/teatisDB/customer/customerGeneral.repository';
import { PostAuthSuccessDto } from '../../controllers/terra/dtos/postAuthSuccessDto';
import { TerraCustomerRepositoryInterface } from '../../repositories/teatisDB/terraCustomer/terraCustomers.repository';
import { CustomerAndTerraCustomer } from '../../domains/CustomerAndTerraCustomer';

export interface PostTerraAuthSuccessUsecaseInterface {
  postTerraAuthSuccess(body:PostAuthSuccessDto):
  Promise<ReturnValueType<CustomerAndTerraCustomer>>;
}

@Injectable()
export class PostTerraAuthSuccessUsecase
implements PostTerraAuthSuccessUsecaseInterface
{
  constructor(
    @Inject('TerraCustomerRepositoryInterface')
    private readonly terraCustomerRepository: TerraCustomerRepositoryInterface,
    @Inject('CustomerGeneralRepositoryInterface')
    private readonly customerGeneralRepository: CustomerGeneralRepositoryInterface,
  ) {}

  async postTerraAuthSuccess({ terraCustomerId, uuid }:PostAuthSuccessDto):
  Promise<ReturnValueType<CustomerAndTerraCustomer>> {
    const [customer, getCustomerError] = await this.customerGeneralRepository.getCustomerByUuid({ uuid });
    if(getCustomerError){
      return [undefined, getCustomerError];
    }

    const [terraCustomer, upsertTerraCustomerError] =
    await this.terraCustomerRepository.upsertTerraCustomer({ terraCustomerId, customerId: customer.id });

    if(upsertTerraCustomerError){
      return [undefined, upsertTerraCustomerError];
    }
    return [terraCustomer];
  }
}
