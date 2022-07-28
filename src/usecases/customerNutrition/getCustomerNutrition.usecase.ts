import { Inject, Injectable } from '@nestjs/common';

import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { GetCustomerNutritionDto } from '@Controllers/discoveries/dtos/getCustomerNutrition';
import { NutritionNeed } from '@Domains/NutritionNeed';


export interface GetCustomerNutritionUsecaseInterface {
  getCustomerNutrition({
    uuid,
  }: GetCustomerNutritionDto): Promise<[NutritionNeed?, Error?]>;
}

@Injectable()
export class GetCustomerNutritionUsecase
  implements GetCustomerNutritionUsecaseInterface
{
  constructor(
    @Inject('CustomerGeneralRepositoryInterface')
    private customerGeneralRepository: CustomerGeneralRepositoryInterface,
  ) {}

  async getCustomerNutrition({
    uuid,
  }: GetCustomerNutritionDto): Promise<
    [NutritionNeed?, Error?]
  > {
    const [customerNutrition, getCustomerNutritionError] =
      await this.customerGeneralRepository.getCustomerNutrition({ uuid });

    if (getCustomerNutritionError) {
      return [null, getCustomerNutritionError];
    }

    return [customerNutrition, null];
  }
}
