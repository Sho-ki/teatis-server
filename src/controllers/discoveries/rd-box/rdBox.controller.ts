import { Controller, Get, Inject, Query, Res } from '@nestjs/common';
import { GetRdBoxDto } from '../dtos/getRdBox';
import { Response } from 'express';
import { GetRdBoxUsecaseInterface } from '../../../usecases/rdBox/getRdBox.usecase';

@Controller('rd-box')
export class RdBoxController {
  constructor(
    @Inject('GetRdBoxUsecaseInterface')
    private getRdBoxUsecase: GetRdBoxUsecaseInterface,
  ) {}
  // Get: api/discovery/customer-nutrition
  @Get('rd-box')
  async getRdBox(@Query() body: GetRdBoxDto, @Res() response: Response) {
    const [res, error] = await this.getRdBoxUsecase.getRdBox(body);
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(res);
  }
}
