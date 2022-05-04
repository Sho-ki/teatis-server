import { Inject, Injectable } from '@nestjs/common';

import { CustomerGeneralRepoInterface } from '@Repositories/teatisDB/customerRepo/customerGeneral.repository';
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
    @Inject('CustomerGeneralRepoInterface')
    private customerGeneralRepo: CustomerGeneralRepoInterface,
  ) {}

  async getCustomerNutrition({
    uuid,
  }: GetCustomerNutritionDto): Promise<
    [GetCustomerNutritionUsecaseRes, Error]
  > {
    const [getCustomerNutritionRes, getCustomerNutritionError] =
      await this.customerGeneralRepo.getCustomerNutrition({ uuid });

    if (getCustomerNutritionError) {
      return [null, getCustomerNutritionError];
    }

    return [getCustomerNutritionRes, null];
  }
}
