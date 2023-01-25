import { Inject, Injectable } from '@nestjs/common';

import { ReturnValueType } from '@Filters/customError';
import { MonthlySelectionRepositoryInterface } from '@Repositories/teatisDB/monthlySelection/monthlySelection.repository';
import { MonthlyBoxSelectionProduct } from '@Domains/MonthlyBoxSelectionProduct';

export interface GetMonthlyProductsUsecaseInterface {
  getMonthlyProducts(): Promise<ReturnValueType<MonthlyBoxSelectionProduct>>;
}

@Injectable()
export class GetMonthlyProductsUsecase
implements GetMonthlyProductsUsecaseInterface
{
  constructor(
    @Inject('MonthlySelectionRepositoryInterface')
    private monthlySelectionRepository: MonthlySelectionRepositoryInterface,
  ) {}
  async getMonthlyProducts(): Promise<ReturnValueType<MonthlyBoxSelectionProduct>> {

    const [monthlyProducts, getMonthlySelectionError] =
      await this.monthlySelectionRepository.getMonthlySelection({ date: new Date(), boxPlan: 'mini' });
    if(getMonthlySelectionError){ return [undefined, getMonthlySelectionError]; }

    return [monthlyProducts, undefined];
  }
}
