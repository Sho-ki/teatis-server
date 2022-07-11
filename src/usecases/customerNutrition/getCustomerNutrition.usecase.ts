import { Inject, Injectable } from '@nestjs/common';

import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { GetCustomerNutritionDto } from '@Controllers/discoveries/dtos/getCustomerNutrition';

interface GetCustomerNutritionUsecaseRes {
  carbsPerMeal: number;
  proteinPerMeal: number;
  fatPerMeal: number;
  sodiumPerMeal: number;
  caloriePerMeal: number;
}

export interface GetCustomerNutritionUsecaseInterface {
  getCustomerNutrition({
    uuid,
  }: GetCustomerNutritionDto): Promise<[GetCustomerNutritionUsecaseRes, Error]>;
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
    [GetCustomerNutritionUsecaseRes, Error]
  > {
    const [customerNutrition, getCustomerNutritionError] =
      await this.customerGeneralRepository.getCustomerNutrition({ uuid });

    if (getCustomerNutritionError) {
      return [null, getCustomerNutritionError];
    }

    return [customerNutrition, null];
  }
}
