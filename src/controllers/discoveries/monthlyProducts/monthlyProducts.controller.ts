import {
  Controller,
  Get,
  Inject,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { GetMonthlyProductsUsecaseInterface } from '@Usecases/monthlyProducts/getMonthlyProducts.usecase';
import { MonthlyBoxSelectionProduct } from '../../../domains/MonthlyBoxSelectionProduct';

@Controller('api/discovery')
export class MonthlyProductsController {
  constructor(
    @Inject('GetMonthlyProductsUsecaseInterface')
    private getMonthlyProductsUsecase: GetMonthlyProductsUsecaseInterface,
  ) {}

  // GET: api/discovery/monthly-products/
  @Get('monthly-products')
  async getMonthlyProducts(
    @Res() response:  Response<MonthlyBoxSelectionProduct | Error>,
  ) {
    const [usecaseResponse, error] =
      await this.getMonthlyProductsUsecase.getMonthlyProducts();
    if (error) {
      return response.status(500).send(error);
    }

    // TODO: Create class serializer (エンドポイントごとにserializerを作成(response.status(500).send(Serializer(usecaseRes));))
    return response.status(200).send(usecaseResponse);
  }
}
