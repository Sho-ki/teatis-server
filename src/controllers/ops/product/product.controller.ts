import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UpsertProductUsecaseInterface } from '../../../usecases/product/upsertProduct.usecase';
import { UpsertProductDto } from './dtos/upsertProduct';

@Controller('api/ops')
export class ProductController {
  constructor(
    @Inject('UpsertProductUsecaseInterface')
    private upsertProductUsecaseInterface: UpsertProductUsecaseInterface,
  ) {}
  @Post('product')
  async upsertProduct(
    @Body() body: UpsertProductDto,
    @Res() response: Response,
  ): Promise<Response> {
    const [res, error] = await this.upsertProductUsecaseInterface.upsertProduct(
      body,
    );
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(201).send(res);
  }
}
